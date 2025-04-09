class BaseController {
  static sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json(data);
  }

  static sendCreated(res, data) {
    return this.sendSuccess(res, data, 201);
  }

  static sendError(res, message, statusCode = 500) {
    return res.status(statusCode).json({ error: message });
  }

  static sendBadRequest(res, message = 'Bad request') {
    return this.sendError(res, message, 400);
  }

  static sendNotFound(res, message = 'Resource not found') {
    return this.sendError(res, message, 404);
  }

  static sendUnauthorized(res, message = 'Unauthorized') {
    return this.sendError(res, message, 401);
  }

  static sendConflict(res, message = 'Conflict') {
    return this.sendError(res, message, 409);
  }

  // Common validation helpers
  static validateRequiredFields(req, fields) {
    const missingFields = fields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`;
    }
    return null;
  }
}

module.exports = BaseController;