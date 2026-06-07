import { Request, Response } from 'express';
import { registerUser } from './auth.service';

/*
======== REGISTER CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/AUTH/REGISTER =========
*/
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const user = await registerUser(username, email, password);

    return res.status(201).json({
      message: 'User registered successfully',

      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
};