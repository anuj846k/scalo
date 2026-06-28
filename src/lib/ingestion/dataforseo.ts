export interface DataForSEOReviewItem {
  review_id?: string;
  review_text?: string;
  rating?: { value?: number };
  profile_name?: string;
  timestamp?: string;
  profile_url?: string;
  profile_image_url?: string;
  review_url?: string;
  owner_answer?: string;
  local_guide?: boolean;
  photos_count?: number;
  reviews_count?: number;
}

export interface DataForSEOTrustpilotReviewItem {
  type?: string;
  url?: string;
  rating?: {
    rating_type?: string;
    value?: number;
    votes_count?: number;
    rating_max?: number;
  };
  verified?: boolean;
  language?: string;
  timestamp?: string;
  title?: string;
  review_text?: string;
  user_profile?: {
    name?: string;
    url?: string;
    image_url?: string;
    location?: string;
    reviews_count?: number;
  };
  responses?: Array<{
    title?: string;
    text?: string;
    timestamp?: string;
  }>;
}

interface TaskPostResponse {
  status_code: number;
  status_message: string;
  tasks: Array<{ id: string }>;
}

interface TasksReadyResponse {
  status_code: number;
  tasks: Array<{ id: string }>;
}

interface TaskGetResponse {
  status_code: number;
  tasks: Array<{
    result?: Array<{
      items?: DataForSEOReviewItem[];
      location_code?: number;
      place_id?: string;
      title?: string;
      sub_title?: string;
    }>;
  }>;
}

interface TrustpilotTaskGetResponse {
  status_code: number;
  tasks: Array<{
    result?: Array<{
      domain?: string;
      title?: string;
      location?: string;
      rating?: { value?: number; votes_count?: number };
      reviews_count?: number;
      items_count?: number;
      items?: DataForSEOTrustpilotReviewItem[];
    }>;
  }>;
}

export interface DataForSEOClient {
  taskPost(params: {
    placeId: string;
    locationCode: number | null;
    locationCoordinate: string | null;
    depth: number;
    sortBy: string;
    pingbackUrl?: string;
  }): Promise<string>;

  taskGet(taskId: string): Promise<{
    items: DataForSEOReviewItem[];
    locationCode?: number;
    placeId?: string;
    title?: string;
    subTitle?: string;
  }>;

  tasksReady(): Promise<string[]>;

  getLocationCode(): Promise<number | null>;

  trustpilotTaskPost(params: {
    domain: string;
    depth: number;
    sortBy: string;
    pingbackUrl?: string;
  }): Promise<string>;

  trustpilotTaskGet(taskId: string): Promise<{
    items: DataForSEOTrustpilotReviewItem[];
    title?: string;
    subTitle?: string;
  }>;
}

export function createDataForSEOClient(
  login?: string,
  password?: string,
): DataForSEOClient {
  const apiLogin = login ?? process.env.DATAFORSEO_LOGIN;
  const apiPassword = password ?? process.env.DATAFORSEO_PASSWORD;

  if (!apiLogin || !apiPassword) {
    throw new Error(
      'DataForSEO credentials not configured. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD env vars.',
    );
  }

  const auth = Buffer.from(`${apiLogin}:${apiPassword}`).toString('base64');
  const baseUrl = 'https://api.dataforseo.com';

  const headers = {
    Authorization: `Basic ${auth}`,
    'Content-Type': 'application/json',
  };

  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, { headers, ...options });
    if (!res.ok) {
      throw new Error(
        `DataForSEO request failed: ${res.status} ${res.statusText}`,
      );
    }
    return res.json();
  }

  return {
    async taskPost({
      placeId,
      locationCode,
      locationCoordinate,
      depth,
      sortBy,
      pingbackUrl,
    }) {
      const task: Record<string, unknown> = {
        language_code: 'en',
        depth,
        sort_by: sortBy,
      };

      if (locationCoordinate) {
        task.location_coordinate = locationCoordinate;
      } else if (locationCode) {
        task.location_code = locationCode;
      }

      if (pingbackUrl) {
        task.pingback_url = pingbackUrl;
      }

      if (placeId.startsWith('name:')) {
        task.keyword = placeId.slice(5);
      } else {
        task.place_id = placeId;
      }

      const body = [task];

      const res = await request<TaskPostResponse>(
        '/v3/business_data/google/reviews/task_post',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );

      if (res.status_code !== 20000 || !res.tasks?.[0]?.id) {
        throw new Error(
          `Failed to create DataForSEO task: ${res.status_message}`,
        );
      }

      return res.tasks[0].id;
    },

    async taskGet(taskId) {
      const res = await request<TaskGetResponse>(
        `/v3/business_data/google/reviews/task_get/${taskId}`,
      );

      if (res.status_code !== 20000) {
        return { items: [], locationCode: undefined, placeId: undefined };
      }

      const result = res.tasks?.[0]?.result?.[0];
      return {
        items: result?.items ?? [],
        locationCode: result?.location_code,
        placeId: result?.place_id,
        title: result?.title,
        subTitle: result?.sub_title,
      };
    },

    async tasksReady() {
      const res = await request<TasksReadyResponse>(
        '/v3/business_data/google/reviews/tasks_ready',
      );

      if (res.status_code !== 20000) {
        return [];
      }

      return res.tasks?.map((t) => t.id) ?? [];
    },

    async getLocationCode() {
      const res = await request<{
        status_code: number;
        tasks: Array<{ result?: Array<{ location_code?: number }> }>;
      }>('/v3/business_data/google/locations');

      const location = res.tasks?.[0]?.result?.[0];
      return location?.location_code ?? null;
    },

    async trustpilotTaskPost({ domain, depth, sortBy, pingbackUrl }) {
      const task: Record<string, unknown> = {
        domain,
        depth,
        sort_by: sortBy,
      };

      if (pingbackUrl) {
        task.pingback_url = pingbackUrl;
      }

      const body = [task];

      const res = await request<TaskPostResponse>(
        '/v3/business_data/trustpilot/reviews/task_post',
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );

      if (res.status_code !== 20000 || !res.tasks?.[0]?.id) {
        throw new Error(
          `Failed to create Trustpilot task: ${res.status_message}`,
        );
      }

      return res.tasks[0].id;
    },

    async trustpilotTaskGet(taskId) {
      const res = await request<TrustpilotTaskGetResponse>(
        `/v3/business_data/trustpilot/reviews/task_get/${taskId}`,
      );

      if (res.status_code !== 20000) {
        return { items: [], title: undefined, subTitle: undefined };
      }

      const result = res.tasks?.[0]?.result?.[0];
      return {
        items: result?.items ?? [],
        title: result?.title,
        subTitle: result?.location,
      };
    },
  };
}
