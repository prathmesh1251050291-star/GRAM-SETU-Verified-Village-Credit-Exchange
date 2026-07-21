const express = require("express");
const router = express.Router();

router.post("/micro-enterprises", async (req, res) => {
    try {
        const { records } = req.body;
        
        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ message: "Invalid payload: records array required" });
        }

        console.log(`Received ${records.length} records for sync.`);
        
        // Mock processing the records (in a real app, save to DB)
        const results = records.map(record => ({
            clientRecordId: record.clientRecordId,
            status: "accepted",
            serverTimestamp: new Date().toISOString()
        }));

        res.status(200).json({
            success: true,
            results: results
        });
    } catch (error) {
        console.error("Sync error:", error);
        res.status(500).json({ message: "Internal server error during sync" });
    }
});

module.exports = router;
