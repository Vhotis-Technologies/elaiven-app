/**
 * Sample house board. One board belongs to a property.
 * A live board replaces this with the posts for the signed-in tenant.
 */

export type HousePostKind = "note" | "bill" | "notice";

export interface HousePost {
  id: string;
  propertyId: string;
  kind: HousePostKind;
  authorName: string;
  body: string;
  /** A bill stays on Home until the tenant's share is settled. */
  settled: boolean;
  /** Calendar date, YYYY-MM-DD. */
  createdOn: string;
}

const POSTS: HousePost[] = [
  {
    id: "post-bins",
    propertyId: "prop-1",
    kind: "notice",
    authorName: "Willian Kling",
    body: "Bins go out Thursday.",
    settled: false,
    createdOn: "2026-11-13",
  },
];

/** Properties where this tenant has already joined the board. */
const JOINED = new Set(["prop-1"]);

function firstName(name: string): string {
  return name.split(" ")[0] || name;
}

function newest(posts: HousePost[]): HousePost | undefined {
  return [...posts].sort((a, b) => (a.createdOn < b.createdOn ? 1 : -1))[0];
}

export function hasJoinedHouseBoard(propertyId: string): boolean {
  return JOINED.has(propertyId);
}

export function housePosts(propertyId: string): HousePost[] {
  return POSTS.filter((post) => post.propertyId === propertyId).sort((a, b) =>
    a.createdOn < b.createdOn ? 1 : -1,
  );
}

/**
 * The one line Home shows.
 * A notice comes before an outstanding bill, and a bill before a note.
 * Null when they have joined and nothing is posted.
 */
export function houseBoardLine(propertyId: string): string | null {
  if (!JOINED.has(propertyId)) return "Join the house board.";

  const posts = POSTS.filter((post) => post.propertyId === propertyId);
  const notice = newest(posts.filter((post) => post.kind === "notice"));
  if (notice) return `${firstName(notice.authorName)} · ${notice.body}`;

  const bill = newest(posts.filter((post) => post.kind === "bill" && !post.settled));
  if (bill) return bill.body;

  const note = newest(posts.filter((post) => post.kind === "note"));
  if (!note) return null;
  return `${firstName(note.authorName)} · ${note.body}`;
}
