import React from 'react';

/**
 * HOC to check if a user has the required permission.
 * @param {ReactNode} children - Component(s) to render.
 * @param {Array} requiredPermissions - Array of required permissions for this content.
 * @param {Array} userPermissions - User's permissions (array of permission names).
 */
const PermissionGuard = ({
  children,
  requiredPermissions,
  userPermissions,
}) => {
  const hasPermission = requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );

  // If user doesn't have the required permissions, return null or alternative content
  if (!hasPermission) {
    return <div>Access Denied</div>; // You can customize this message or redirect to another page
  }

  return children;
};

export default PermissionGuard;
