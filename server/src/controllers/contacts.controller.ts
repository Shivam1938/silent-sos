import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ContactModel } from '../models/Contact.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

export const listContacts = async (req: AuthenticatedRequest, res: Response) => {
  const contacts = await ContactModel.find({ user: req.userId }).lean();
  return res.status(StatusCodes.OK).json({ contacts });
};

export const createContact = async (req: AuthenticatedRequest, res: Response) => {
  const { name, phoneNumber, relationship, email } = req.body;
  const contact = await ContactModel.create({
    user: req.userId,
    name,
    phoneNumber,
    relationship,
    email,
  });
  return res.status(StatusCodes.CREATED).json({ contact });
};

export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  await ContactModel.findOneAndDelete({ _id: id, user: req.userId });
  return res.status(StatusCodes.NO_CONTENT).send();
};

