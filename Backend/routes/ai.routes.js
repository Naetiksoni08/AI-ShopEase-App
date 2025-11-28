const router = require("express").Router();
const aiController = require("../controllers/ai.contoller");

router.post("/summarize", aiController.summarize);

module.exports = router;
