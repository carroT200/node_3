const checkUserAccess = (req, res, next) => {
  if (!req.user) {
    res.status(403).json({ message: 'acces denied' });
  }
  next();
};

const checkAdminAccess = (req, res, next) => {
  if (!req.user.super) {
    res.status(403).json({ message: 'Forbidden for non-admins' });
  }
  next();
};

module.exports = {
  checkUserAccess,
  checkAdminAccess,
};
