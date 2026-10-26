import { describe, expect, it } from "vitest";
import { latestByType } from "./golf";

describe("latestByType", () => {
  it("keeps the most recent log per work type", () => {
    const m = latestByType([
      { id: "1", area_id: "a", work_type: "Trimning", staff_name: "Anna", comment: null, done_at: "2026-10-01T10:00:00Z" },
      { id: "2", area_id: "a", work_type: "Trimning", staff_name: "Erik", comment: null, done_at: "2026-10-05T10:00:00Z" },
    ]);
    expect(m.get("Trimning")?.staff_name).toBe("Erik");
  });
});
