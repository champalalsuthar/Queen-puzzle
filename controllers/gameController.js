const Value = require("../models/Value");
const ValueLevel = require("../models/ValueLevel");
const Board = require("../models/Board");
const { apiResponse } = require("../utils/apiResponse");

/*HELPERS*/
const getExecutionTime = (start) => {
  const diff = process.hrtime(start);
  return diff[0] + diff[1] / 1e9;
};

/*ACTIVE APIs */
exports.getActiveValues = async (req, res) => {
  const start = process.hrtime();
  try {
    const data = await Value.find({ status: "active" });
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({
      status: false, status_code: 500, message: "Server error", errors: err.message
    }));
  }
};

exports.getActiveLevelByValue = async (req, res) => {
  const start = process.hrtime();
  const value = Number(req.params.value);

  try {
    const valueDoc = await Value.findOne({ value, status: "active" });
    if (!valueDoc) {
      return res.json(apiResponse({
        status: false, status_code: 400, message: "Invalid or inactive value", errors: "VALUE_NOT_ACTIVE"
      }));
    }

    const data = await ValueLevel.find({ value, status: "active" });
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({
      status: false, status_code: 500, message: "Server error", errors: err.message
    }));
  }
};

exports.getBoardByValueAndLevel = async (req, res) => {
  const start = process.hrtime();
  const value = Number(req.params.value);
  const level = Number(req.params.level);

  try {
    const valueDoc = await Value.findOne({ value, status: "active" });
    if (!valueDoc) {
      return res.json(apiResponse({
        status: false, status_code: 400, message: "Invalid value", errors: "VALUE_NOT_ACTIVE"
      }));
    }

    const levelDoc = await ValueLevel.findOne({ value, level, status: "active" });
    if (!levelDoc) {
      return res.json(apiResponse({
        status: false, status_code: 402, message: "Invalid level", errors: "LEVEL_NOT_ACTIVE"
      }));
    }

    const board = await Board.findOne({ gridSize: value, level });
    if (!board) {
      return res.json(apiResponse({
        status: false, status_code: 404, message: "Board not found", errors: "BOARD_NOT_FOUND"
      }));
    }

    return res.json(apiResponse({ result: board, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({
      status: false, status_code: 500, message: "Server error", errors: err.message
    }));
  }
};

/*GET ALL*/

exports.getAllValues = async (req, res) => {
  const start = process.hrtime();
  try {
    const data = await Value.find();
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, status_code: 500, message: "Server error", errors: err.message }));
  }
};

exports.getAllLevel = async (req, res) => {
  const start = process.hrtime();
  try {
    const data = await ValueLevel.find();
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, status_code: 500, message: "Server error", errors: err.message }));
  }
};

exports.getAllLevelByValue = async (req, res) => {
  const start = process.hrtime();
  try {
    const valueDoc = await Value.findOne({ value: req.params.value });
    if (!valueDoc) {
      return res.json(apiResponse({
        status: false, status_code: 400, message: "Invalid value", errors: "VALUE_NOT_VALID"
      }));
    }

    const data = await ValueLevel.find({ value: Number(req.params.value) });
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, status_code: 500, message: "Server error", errors: err.message }));
  }
};

exports.getAllBoard = async (req, res) => {
  const start = process.hrtime();
  try {
    const data = await Board.find();
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, status_code: 500, message: "Server error", errors: err.message }));
  }
};

exports.getAllBoardbyvalue = async (req, res) => {
  const start = process.hrtime();
  const value = Number(req.query.value);

  try {
    const valueDoc = await Value.findOne({ value: value });
    if (!valueDoc) {
      return res.json(apiResponse({
        status: false, status_code: 400, message: "Invalid value", errors: "VALUE_NOT_VALID"
      }));
    }
    const data = await Board.find({ gridSize: value });
    return res.json(apiResponse({ result: data, executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(500).json(apiResponse({ status: false, status_code: 500, message: "Server error", errors: err.message }));
  }
};

/*ADD*/

exports.addValue = async (req, res) => {
  const start = process.hrtime();
  try {
    const { value } = req.body;

    const exists = await Value.findOne({ value });
    if (exists) {
      return res.json(apiResponse({
        status: false,
        status_code: 409,
        message: "Value already exists",
        errors: "VALUE_DUPLICATE"
      }));
    }

    const data = await Value.create(req.body);
    return res.json(apiResponse({
      result: data,
      message: "Value added",
      executionTime: getExecutionTime(start)
    }));
  } catch (err) {
    return res.status(400).json(apiResponse({
      status: false,
      status_code: 400,
      message: "Add failed",
      errors: err.message
    }));
  }
};

exports.addLevel = async (req, res) => {
  const start = process.hrtime();
  try {
    const { value, level } = req.body;

    // value must exist
    const valueDoc = await Value.findOne({ value });
    if (!valueDoc) {
      return res.json(apiResponse({
        status: false,
        status_code: 400,
        message: "Invalid value",
        errors: "VALUE_NOT_EXIST"
      }));
    }

    // unique level per value
    const exists = await ValueLevel.findOne({ value, level });
    if (exists) {
      return res.json(apiResponse({
        status: false,
        status_code: 409,
        message: "Level already exists for this value",
        errors: "LEVEL_DUPLICATE"
      }));
    }

    const data = await ValueLevel.create(req.body);
    return res.json(apiResponse({
      result: data,
      message: "Level added",
      executionTime: getExecutionTime(start)
    }));
  } catch (err) {
    return res.status(400).json(apiResponse({
      status: false,
      status_code: 400,
      message: "Add failed",
      errors: err.message
    }));
  }
};

exports.addBoard = async (req, res) => {
  const start = process.hrtime();
  try {
    const { gridSize, level } = req.body;

    // value must exist
    const valueDoc = await Value.findOne({ value: gridSize });
    if (!valueDoc) {
      return res.json(apiResponse({
        status: false,
        status_code: 400,
        message: "Invalid value",
        errors: "VALUE_NOT_EXIST"
      }));
    }

    // level must exist
    const levelDoc = await ValueLevel.findOne({ value: gridSize, level });
    if (!levelDoc) {
      return res.json(apiResponse({
        status: false,
        status_code: 400,
        message: "Invalid level",
        errors: "LEVEL_NOT_EXIST"
      }));
    }

    // unique board
    const exists = await Board.findOne({ gridSize, level });
    if (exists) {
      return res.json(apiResponse({
        status: false,
        status_code: 409,
        message: "Board already exists",
        errors: "BOARD_DUPLICATE"
      }));
    }

    const data = await Board.create(req.body);
    return res.json(apiResponse({
      result: data,
      message: "Board added",
      executionTime: getExecutionTime(start)
    }));
  } catch (err) {
    return res.status(400).json(apiResponse({
      status: false,
      status_code: 400,
      message: "Add failed",
      errors: err.message
    }));
  }
};

/*UPDATE BY ID*/

exports.updateValueById = async (req, res) => {
  const start = process.hrtime();
  const { id, updateData } = req.body;

  try {
    const updated = await Value.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.json(
        apiResponse({
          status: false,
          status_code: 404,
          message: "Value not found",
          errors: "VALUE_NOT_FOUND"
        })
      );
    }

    const diff = process.hrtime(start);
    const time = diff[0] + diff[1] / 1e9;

    return res.json(
      apiResponse({
        result: updated,
        executionTime: time
      })
    );
  } catch (err) {
    return res.status(500).json(
      apiResponse({
        status: false,
        status_code: 500,
        message: "Server error",
        errors: err.message
      })
    );
  }
};

exports.updateLevelById = async (req, res) => {
  const start = process.hrtime();
  const { id, updateData } = req.body;

  try {
    const updated = await ValueLevel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.json(
        apiResponse({
          status: false,
          status_code: 404,
          message: "Level not found",
          errors: "LEVEL_NOT_FOUND"
        })
      );
    }

    const diff = process.hrtime(start);
    const time = diff[0] + diff[1] / 1e9;

    return res.json(
      apiResponse({
        result: updated,
        executionTime: time
      })
    );
  } catch (err) {
    return res.status(500).json(
      apiResponse({
        status: false,
        status_code: 500,
        message: "Server error",
        errors: err.message
      })
    );
  }
};

exports.updateBoardById = async (req, res) => {
  const start = process.hrtime();
  const { id, updateData } = req.body;

  try {
    const updated = await Board.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.json(
        apiResponse({
          status: false,
          status_code: 404,
          message: "Board not found",
          errors: "BOARD_NOT_FOUND"
        })
      );
    }

    const diff = process.hrtime(start);
    const time = diff[0] + diff[1] / 1e9;

    return res.json(
      apiResponse({
        result: updated,
        executionTime: time
      })
    );
  } catch (err) {
    return res.status(500).json(
      apiResponse({
        status: false,
        status_code: 500,
        message: "Server error",
        errors: err.message
      })
    );
  }
};

/*DELETE BY ID*/

exports.deleteValueById = async (req, res) => {
  const start = process.hrtime();
  try {
    await Value.findByIdAndDelete(req.query.id);
    return res.json(apiResponse({ message: "Value deleted", executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(400).json(apiResponse({ status: false, status_code: 400, message: "Delete failed", errors: err.message }));
  }
};

exports.deleteLevelById = async (req, res) => {
  const start = process.hrtime();
  try {
    await ValueLevel.findByIdAndDelete(req.query.id);
    return res.json(apiResponse({ message: "Level deleted", executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(400).json(apiResponse({ status: false, status_code: 400, message: "Delete failed", errors: err.message }));
  }
};

exports.deleteBoardById = async (req, res) => {
  const start = process.hrtime();
  try {
    await Board.findByIdAndDelete(req.query.id);
    return res.json(apiResponse({ message: "Board deleted", executionTime: getExecutionTime(start) }));
  } catch (err) {
    return res.status(400).json(apiResponse({ status: false, status_code: 400, message: "Delete failed", errors: err.message }));
  }
};
