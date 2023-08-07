import { Request, Response } from "express";

export const handleLogout = (req: Request, res: Response) => { 
    res.clearCookie("jwt")
    res.clearCookie("refreshToken")
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully.' });
}
