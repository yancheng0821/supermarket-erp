export function hasPermission(permission: string, permissions: string[]) {
  return permissions.includes(permission)
}

export function hasAnyPermission(
  requiredPermissions: string[],
  permissions: string[]
) {
  return requiredPermissions.some((permission) =>
    hasPermission(permission, permissions)
  )
}
