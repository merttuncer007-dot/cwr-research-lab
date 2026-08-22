import hashlib
import sqlite3
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import cwr_lab  # noqa: E402


class PersistentLabTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cwr_lab.init_db()
        cls.conn = cwr_lab.connect()

    @classmethod
    def tearDownClass(cls):
        cls.conn.close()

    def scalar(self, sql):
        return self.conn.execute(sql).fetchone()[0]

    def test_sqlite_integrity(self):
        self.assertEqual(self.scalar("PRAGMA integrity_check"), "ok")

    def test_full_conversation_is_parsed(self):
        self.assertEqual(self.scalar("SELECT MAX(turn_no) FROM conversation_turns"), 88)
        self.assertEqual(self.scalar("SELECT COUNT(*) FROM conversation_turns"), 88)

    def test_registry_and_recovered_state_are_not_conflated(self):
        self.assertEqual(self.scalar("SELECT MAX(number) FROM byproduct_versions"), 212)
        self.assertEqual(self.scalar("SELECT MAX(number) FROM byproducts"), 220)
        row = self.conn.execute(
            "SELECT evidence_level,artifact_state FROM byproducts WHERE code='CWR-BP-220'"
        ).fetchone()
        self.assertEqual(row["evidence_level"], "TRANSCRIPT_SUMMARY")
        self.assertEqual(row["artifact_state"], "CANONICAL_ARTIFACT_MISSING")

    def test_duplicate_occurrences_are_preserved_but_blobs_are_deduplicated(self):
        occurrences = self.scalar("SELECT COUNT(*) FROM occurrences")
        blobs = self.scalar("SELECT COUNT(*) FROM content_blobs")
        self.assertGreater(occurrences, blobs)
        self.assertGreater(self.scalar(
            "SELECT COUNT(*) FROM (SELECT blob_sha256 FROM occurrences GROUP BY blob_sha256 HAVING COUNT(*)>1)"
        ), 0)

    def test_all_content_objects_match_hash(self):
        for row in self.conn.execute("SELECT sha256,object_relpath FROM content_blobs"):
            data = (ROOT / row["object_relpath"]).read_bytes()
            self.assertEqual(hashlib.sha256(data).hexdigest(), row["sha256"])

    def test_frontier_search(self):
        rows = cwr_lab.search_rows(self.conn, "rank two PSD scalar sign", 5)
        self.assertTrue(rows)

    def test_skill_frontmatter(self):
        skill = (ROOT / "skills" / "cwr-research-lab" / "SKILL.md").read_text(encoding="utf-8")
        self.assertTrue(skill.startswith("---\nname: cwr-research-lab\n"))
        self.assertIn("\ndescription:", skill.split("---", 2)[1])


if __name__ == "__main__":
    unittest.main()
