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
  }): Promise<string>;

  taskGet(taskId: string): Promise<{
    items: DataForSEOReviewItem[];
    locationCode?: number;
  }>;

  tasksReady(): Promise<string[]>;

  getLocationCode(): Promise<number | null>;
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

      if (placeId.startsWith('name:')) {
        task.keyword = placeId.slice(5);
      } else if (placeId.startsWith('cid:') || placeId.startsWith('ftid:')) {
        task.keyword = placeId;
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
        throw new Error(`Failed to get DataForSEO task: ${res.status_code}`);
      }

      const result = res.tasks?.[0]?.result?.[0];
      return {
        items: result?.items ?? [],
        locationCode: result?.location_code,
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
  };
}
