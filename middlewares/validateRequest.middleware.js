const jsend = require('jsend');

const validateRequest = (schema) => (req, res, next) => {
  try {
    const params = { ...req.params };
    if (params.id) {
      params.id = parseInt(params.id, 10);
    }

    const data = { ...req.body, ...params, ...req.query };
    req.validatedData = schema.parse(data);
    next();
  } catch (error) {
    res.status(422).json(jsend.fail({
      error: error.errors || error.issues?.map(issue => issue.message) || "Validation failed"
    }));
  }
};

module.exports = validateRequest;