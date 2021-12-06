import { body } from 'express-validator'

export const reviewsBodyValidator = [
    body('comment').exists().isLength({ min: 1 }).withMessage('You Must Have A Comment'),
    body('rating').exists().isLength({ min: 1 }).withMessage('You Must Have A rating'),
    body('productId').exists().isLength({ min: 1 }).withMessage('You Must Have A productId')
]