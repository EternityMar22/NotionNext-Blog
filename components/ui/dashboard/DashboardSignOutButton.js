// import { SignOutButton } from '@clerk/nextjs'

/**
 * 控制台登出按钮
 * @returns
 */
export default function DashboardSignOutButton() {
  const enableClerk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!enableClerk) {
    return null
  }

  // return (
  //   <SignOutButton redirectUrl={'/'}>
  //     <button className='btn'>登出</button>
  //   </SignOutButton>
  // )

  return null
}
