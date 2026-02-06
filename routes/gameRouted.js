const express = require("express");
const router = express.Router();
const controller = require("../controllers/gameController");

router.get("/values/active", controller.getActiveValues);
router.get("/levels/active/:value", controller.getActiveLevelByValue);
router.get("/board/:value/:level", controller.getBoardByValueAndLevel);

router.get("/values/all", controller.getAllValues);
router.get("/levels/all", controller.getAllLevel);
router.get("/levels/all/:value", controller.getAllLevelByValue);
router.get("/board/all", controller.getAllBoard);
router.get("/board/all/value", controller.getAllBoardbyvalue);

router.post("/values/add", controller.addValue);
router.post("/levels/add", controller.addLevel);
router.post("/board/add", controller.addBoard);

router.post("/values/updatebyid", controller.updateValueById);
router.post("/levels/updatebyid", controller.updateLevelById);
router.post("/board/updatebyid", controller.updateBoardById);

router.delete("/values/deletebyid", controller.deleteValueById);
router.delete("/levels/deletebyid", controller.deleteLevelById);
router.delete("/board/deletebyid", controller.deleteBoardById);

module.exports = router;
