// Simple example of role-based access via header or route
export function validateRole(allowedRoles = []) {
  return (req, res, next) => {
    // In real app, derive from auth token; here we accept header for testing.
    const role = (req.headers["x-docapp-role"] || "").toLowerCase();

    if (allowedRoles.length && !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: role not allowed"
      });
    }

    // Attach role to request for downstream use
    req.role = role;
    next();
  };
}
