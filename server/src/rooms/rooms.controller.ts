import { Request, Response } from 'express';
import * as roomsService from './room.service';

/*
======== CREATE ROOM CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/ROOMS =========
*/
export const createRoom = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const room = await roomsService.createRoom(req.userId);

    return res.status(201).json(room);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: 'Failed to create room',
    });
  }
};

/*
======== GET ROOM CONTROLLER ===========
======== ROUTE - GET ===============
======= ENDPOINT - /API/V1/ROOMS/:CODE =========
*/
export const getRoomByCode = async (req: Request, res: Response) => {
  try {
    const room = await roomsService.getRoomByCode(req.params.code as string);

    if (!room) {
      return res.status(404).json({
        message: 'Room not found',
      });
    }

    return res.json(room);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: 'Failed to fetch room',
    });
  }
};

/*
======== JOIN ROOM CONTROLLER ===========
======== ROUTE - POST ===============
======= ENDPOINT - /API/V1/ROOMS/:CODE/JOIN =========
*/
export const joinRoom = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const room = await roomsService.joinRoom(req.params.code as string, req.userId);

    return res.json(room);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : 'Failed to join room',
    });
  }
};