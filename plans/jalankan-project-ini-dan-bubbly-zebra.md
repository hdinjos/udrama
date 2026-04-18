# Plan: Sync IMDB API to Database

## Context

User wants to fetch drama data from the IMDB API (`https://api.imdbapi.dev/titles?types=TV_SERIES&countryCodes=ID`) and save it to the local database. Series data goes to the `series` table, and genres from the API response should be extracted and stored in the `genres` table, then linked via `series_genres`.

## Implementation

### 1. Create `ImdbService` — fetch + sync logic

**New file:** `src/modules/dramas/services/imdb.service.ts`

Responsibilities:
- `fetchTitles(pageToken?)` — call `GET https://api.imdbapi.dev/titles?types=TV_SERIES&countryCodes=ID`
- `syncAll()` — orchestrates the full sync:
  1. Fetch all titles from IMDB API (handle pagination via `nextPageToken`)
  2. Extract unique genres from all titles
  3. Upsert genres: for each genre name, check if it exists in `genres` table. If yes, reuse existing record. If no, insert new genre with auto-generated slug (reuse `generateSlug` from `src/utils/helper.ts`)
  4. Upsert series: for each title, check if `imdbId` exists. If yes, update. If no, insert
  5. Link series-genres: for each series, insert into `series_genres` (skip duplicates)

Key mappings:
| IMDB API | DB Field |
|---|---|
| `id` | `series.imdbId` |
| `type` | `series.type` |
| `primaryTitle` | `series.primaryTitle` |
| `originalTitle` | `series.originalTitle` |
| `plot` | `series.plot` |
| `startYear` | `series.startYear` |
| `endYear` | `series.endYear` |
| `rating.aggregateRating` | `series.rating` |
| `rating.voteCount` | `series.voteCount` |
| `genres[]` | `genres` + `series_genres` |
| `primaryImage.url` | `series.thumbnailUrl` |

### 2. Add endpoint to trigger sync

**Modify:** `src/modules/dramas/series/dramas.controller.ts`

Add `POST /series/sync-imdb` endpoint that calls `ImdbService.syncAll()`.

### 3. Wire up in DramasModule

**Modify:** `src/modules/dramas/dramas.module.ts`
- Add `ImdbService` to providers

## Files to modify/create

| Action | File |
|---|---|
| Create | `src/modules/dramas/services/imdb.service.ts` |
| Modify | `src/modules/dramas/dramas.module.ts` |
| Modify | `src/modules/dramas/series/dramas.controller.ts` |

## Verification

1. `npm run build` — no errors
2. `curl -X POST http://localhost:3000/series/sync-imdb -H "Authorization: Bearer $TOKEN"` — returns success
3. Check DB: `SELECT COUNT(*) FROM series;` — should have series data
4. Check DB: `SELECT COUNT(*) FROM genres;` — should have genre data
5. Check DB: `SELECT COUNT(*) FROM series_genres;` — should have links
6. `GET /series` — should return synced series with genres
