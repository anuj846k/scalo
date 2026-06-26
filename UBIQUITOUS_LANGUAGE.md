# Ubiquitous Language

## Feedback lifecycle

| Term              | Definition                                                                                                                                                         | Aliases to avoid                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| **Feedback Item** | A single piece of customer input stored in the system. Has text, rating, author, source, and an embedding.                                                         | Review, comment, ticket (these are source-specific) |
| **Source**        | The origin of a feedback item: `csv`, `google_reviews`, `instagram`, or `zendesk`. Every feedback item has exactly one source.                                     | Channel, platform, origin                           |
| **Ingestion**     | The end-to-end pipeline of importing feedback: parse raw data → normalize into schema → generate embedding → store.                                                | Import, upload                                      |
| **Normalization** | Transforming raw source data into the shared feedback item schema. Converts source-specific fields (e.g., `review_text` → `text`, `profile_name` → `author_name`). | Mapping, transformation                             |
| **Embedding**     | A 768-dimensional vector representation of feedback text, generated server-side via `gemini-embedding-001`. Stored in `feedback_embeddings` with pgvector.         | Vector, encoding                                    |
| **Retrieval**     | Finding feedback items semantically relevant to a user's chat question using cosine distance (`<=>`) against stored embeddings.                                    | Search, vector search, semantic search              |

## Connectors

| Term                 | Definition                                                                                                                               | Aliases to avoid            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **Connector**        | A pluggable integration that pulls feedback from an external source (CSV file, Google Reviews, Instagram, Zendesk).                      | Integration, plugin         |
| **Connector Config** | A persisted record linking a workspace to a connected external entity. Contains connector type, Place ID, location code, and sync state. | Connection, configuration   |
| **Place ID**         | A Google Maps unique identifier for a business location. Used to target which business's reviews to fetch.                               | Place identifier, Google ID |
| **Location Code**    | A DataForSEO numeric code identifying a geographic region (e.g., `2840` for US). Required by the DataForSEO API alongside a Place ID.    | Region code                 |

## Sync

| Term                | Definition                                                                                                                                                     | Aliases to avoid             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Sync**            | The act of fetching feedback from an external source and storing it. Includes normalization, embedding generation, and deduplication.                          | Pull, fetch, update          |
| **Initial Sync**    | The first sync for a newly connected source. Fetches ALL available feedback (depth: 4490) to seed the database.                                                | First fetch, bootstrap, seed |
| **Cron Sync**       | An automated daily sync (midnight UTC via Inngest) that fetches only recent feedback (depth: 20, sort: newest) and upserts new items.                          | Scheduled sync, daily sync   |
| **DataForSEO Task** | An async job submitted to the DataForSEO API. Created via `task_post`, processed by DataForSEO, results collected via `task_get`.                              | API task                     |
| **Depth**           | The number of feedback items to request from DataForSEO per task. Charged per 10 items. Initial sync uses max depth (4490); cron syncs use shallow depth (20). | Batch size                   |
| **Deduplication**   | Ensuring a feedback item from the same source and same external ID is not stored twice. Implemented as UPSERT on `(source, source_item_id)`.                   | Dedup, upsert                |

## Analysis (future)

| Term          | Definition                                                                                                 | Aliases to avoid     |
| ------------- | ---------------------------------------------------------------------------------------------------------- | -------------------- |
| **Theme**     | A recurring topic extracted from feedback text (e.g., service, pricing, cleanliness). Not yet implemented. | Topic, category, tag |
| **Sentiment** | Classification of a feedback item's tone: `positive`, `neutral`, or `negative`. Not yet implemented.       | Tone, mood, polarity |

## Workspace

| Term                 | Definition                                                                                                                                                                     | Aliases to avoid                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| **Workspace**        | A tenant boundary. All data (feedback items, chats, connector configs) is scoped to a single workspace. Called **Organization** in the database schema and Better Auth plugin. | Organization, org, team, tenant |
| **Active Workspace** | The workspace currently selected in a user's session, stored as `session.activeOrganizationId`. All API calls scope data to the active workspace.                              | Current org                     |

## Chat

| Term             | Definition                                                                                                                                               | Aliases to avoid     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| **Chat**         | A conversation session where the user asks natural-language questions about their feedback corpus. The LLM answers using retrieved feedback as evidence. | Conversation, thread |
| **Chat Message** | A single message in a chat. Role is `user` or `assistant`. Assistant messages may contain tool-call parts for feedback retrieval.                        | Message, turn        |

## Relationships

- A **Feedback Item** has exactly one **Source** and exactly one **Workspace**.
- A **Feedback Item** has exactly one **Embedding**.
- A **Connector Config** belongs to exactly one **Workspace** and has exactly one **Connector** type.
- A **Sync** operates on exactly one **Connector Config** and produces zero or more **Feedback Items**.
- A **DataForSEO Task** is created by a **Sync** and yields the feedback items for that sync.
- A **Chat** belongs to exactly one **Workspace** and contains many **Chat Messages**.
- **Retrieval** queries **Embeddings** to find relevant **Feedback Items** for a **Chat Message**.

## Example dialogue

> **Dev:** "When a user connects a Google business, do we run the **Initial Sync** synchronously in the API route?"
>
> **Domain expert:** "No — the API route creates the **Connector Config** and fires an Inngest event. The **Initial Sync** runs inside the Inngest function, which creates a **DataForSEO Task**, polls until ready, then normalizes and stores each **Feedback Item** with its **Embedding**."
>
> **Dev:** "What about the **Cron Sync** — does it also create **DataForSEO Tasks**?"
>
> **Domain expert:** "Same mechanism. The Inngest function handles both triggers. For the **Cron Sync**, it reads all active **Connector Configs**, submits a **DataForSEO Task** per config with **Depth** 20 and sort newest, then upserts new **Feedback Items** using **Deduplication** on `source_item_id`."
>
> **Dev:** "So if a review was already ingested during the **Initial Sync**, the **Cron Sync** skips it?"
>
> **Domain expert:** "Exactly. **Deduplication** ensures we never store the same review twice, but if a reviewer edits their text or rating, we update our copy."
>
> **Dev:** "And this all stays scoped to the user's **Active Workspace**?"
>
> **Domain expert:** "Yes. Each **Connector Config** stores the **Workspace** ID. The **Sync** writes every **Feedback Item** with that same **Workspace** ID."

## Flagged ambiguities

- **"Organization" vs "Workspace"** — The database schema and Better Auth plugin use **Organization**, but the UI and domain language should use **Workspace**. The canonical term is **Workspace**. Keep `organization_id` as the column name for consistency with the DB and auth framework, but refer to it as "workspace" in all other contexts.
- **"Review"** — Used specifically for Google Reviews (a source-specific concept). Do not use "review" to mean a generic **Feedback Item**. A Google Review _becomes_ a Feedback Item after ingestion. Similarly, an Instagram comment or Zendesk ticket _becomes_ a Feedback Item.
- **"Task"** — Overloaded. A **DataForSEO Task** means an async job in the DataForSEO system. An Inngest function is NOT called a "task" — always prefix with the system name when ambiguous. Never call an Inngest function a "task."
- **"Source"** — Used both as the `source` column value (`csv`, `google_reviews`) and colloquially to mean "external origin of data." Prefer **Connector** for the integration and **Source** only for the column value.
