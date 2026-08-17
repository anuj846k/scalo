import { db } from '@/db/drizzle';
import { connectorConfigs } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface CreateConnectorConfigParams {
  organizationId: string;
  connectorType: string;
  placeId: string;
  locationCode?: number;
  locationCoordinate?: string;
  title?: string;
  subTitle?: string;
  status?: string;
}

interface ConnectorConfig {
  id: string;
  organizationId: string;
  connectorType: string;
  placeId: string;
  title: string | null;
  subTitle: string | null;
  locationCode: number | null;
  locationCoordinate: string | null;
  lastSyncedAt: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createConnectorConfig(
  params: CreateConnectorConfigParams,
): Promise<ConnectorConfig> {
  const id = crypto.randomUUID();
  const now = new Date();

  const [record] = await db
    .insert(connectorConfigs)
    .values({
      id,
      organizationId: params.organizationId,
      connectorType: params.connectorType,
      placeId: params.placeId,
      title: params.title ?? null,
      subTitle: params.subTitle ?? null,
      locationCode: params.locationCode ?? null,
      locationCoordinate: params.locationCoordinate ?? null,
      status: params.status ?? 'active',
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return record as ConnectorConfig;
}

export async function getConfigsByWorkspace(
  organizationId: string,
): Promise<ConnectorConfig[]> {
  return db
    .select()
    .from(connectorConfigs)
    .where(eq(connectorConfigs.organizationId, organizationId))
    .then((rows) => rows as ConnectorConfig[]);
}

export async function updateSyncTimestamp(
  id: string,
  organizationId: string,
): Promise<void> {
  await db
    .update(connectorConfigs)
    .set({ lastSyncedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(connectorConfigs.id, id),
        eq(connectorConfigs.organizationId, organizationId),
      ),
    );
}

export async function updateLocationCode(
  id: string,
  locationCode: number,
): Promise<void> {
  await db
    .update(connectorConfigs)
    .set({ locationCode, updatedAt: new Date() })
    .where(eq(connectorConfigs.id, id));
}

export async function deleteConfig(
  id: string,
  organizationId: string,
): Promise<void> {
  await db
    .delete(connectorConfigs)
    .where(
      and(
        eq(connectorConfigs.id, id),
        eq(connectorConfigs.organizationId, organizationId),
      ),
    );
}

export async function getConfigByPlaceId(
  organizationId: string,
  connectorType: string,
  placeId: string,
): Promise<ConnectorConfig | null> {
  const [record] = await db
    .select()
    .from(connectorConfigs)
    .where(
      and(
        eq(connectorConfigs.organizationId, organizationId),
        eq(connectorConfigs.connectorType, connectorType),
        eq(connectorConfigs.placeId, placeId),
      ),
    )
    .limit(1);

  return (record as ConnectorConfig) ?? null;
}

export async function getConfigById(
  id: string,
  organizationId: string,
): Promise<ConnectorConfig | null> {
  const [record] = await db
    .select()
    .from(connectorConfigs)
    .where(
      and(
        eq(connectorConfigs.id, id),
        eq(connectorConfigs.organizationId, organizationId),
      ),
    )
    .limit(1);

  return (record as ConnectorConfig) ?? null;
}
