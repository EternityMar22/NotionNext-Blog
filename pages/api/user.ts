// import { getAuth } from '@clerk/nextjs/server'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Clerk 身份测试
 * @param req
 * @param res
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // const { userId } = getAuth(req)
  // return res.status(200).json({ userId })

  // 返回未登录状态
  return res
    .status(200)
    .json({ userId: null, message: 'Clerk authentication is disabled' })
}
