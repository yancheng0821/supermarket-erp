import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = resolve(__dirname, '../../..')

function read(relativePath: string) {
  return readFileSync(resolve(repoRoot, relativePath), 'utf8')
}

describe('clerk route i18n coverage', () => {
  it('defines the expected clerk locale keys in both languages', () => {
    const en = JSON.parse(read('src/i18n/locales/en.json'))
    const zh = JSON.parse(read('src/i18n/locales/zh.json'))

    expect(en.clerk).toMatchObject({
      missingKeyTitle: expect.any(String),
      setupKeyTitle: expect.any(String),
      optionalTitle: expect.any(String),
      authLayoutIntro: expect.any(String),
      backToDashboard: expect.any(String),
      userManagementProfileHint: expect.any(String),
      unauthorizedHint: expect.any(String),
      cancelRedirect: expect.any(String),
    })

    expect(zh.clerk).toMatchObject({
      missingKeyTitle: '未找到 Clerk 发布密钥',
      setupKeyTitle: '设置 Clerk API 密钥',
      optionalTitle: 'Clerk 集成是可选的',
      authLayoutIntro: '欢迎来到 Clerk 登录演示页。',
      backToDashboard: '返回仪表盘',
      userManagementProfileHint:
        '可通过页面右上角的用户资料菜单执行登出、管理账号或删除账号。',
      unauthorizedHint: '需要先通过 Clerk 登录才能访问此路由。',
      cancelRedirect: '取消跳转',
    })
  })

  it('removes the original hard-coded english copy from the clerk route files', () => {
    const rootRoute = read('src/routes/clerk/route.tsx')
    const authRoute = read('src/routes/clerk/(auth)/route.tsx')
    const userManagementRoute = read(
      'src/routes/clerk/_authenticated/user-management.tsx'
    )

    expect(rootRoute).not.toContain('No Publishable Key Found!')
    expect(rootRoute).not.toContain('Set your Clerk API key')
    expect(rootRoute).not.toContain('Clerk Integration is Optional')
    expect(authRoute).not.toContain('Welcome to the example Clerk auth page.')
    expect(authRoute).not.toContain('Back to')
    expect(userManagementRoute).not.toContain('Unauthorized Access')
    expect(userManagementRoute).not.toContain('Go Back')
    expect(userManagementRoute).not.toContain('Cancel Redirect')
    expect(userManagementRoute).not.toContain(
      'You must first sign in using Clerk to access this route.'
    )
  })
})
