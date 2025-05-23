// import { UserProfile } from '@clerk/nextjs'

/**
 * 控制台用户账号面板
 * @returns
 */
export default function DashboardUser() {
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!enableClerk) {
    return <div className='text-center p-4'>用户认证功能已禁用</div>
  }

  // return <UserProfile />
  return <div className='text-center p-4'>用户认证功能已禁用</div>
}
