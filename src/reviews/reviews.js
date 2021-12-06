import express from 'express'
import { getReviews, writeReview } from '../lib/fs-tools.js'
import uniqid from 'uniqid'
import createHttpError from 'http-errors'
import { validationResult } from 'express-validator'
import { reviewsBodyValidator } from '../middleware/valiation.js'

const reviewsRouter = express.Router()

reviewsRouter.route('/')
.get(async (req, res, next) => {
    try {
        const reviews = await getReviews()
        res.send(reviews)    
    } catch (error) {
        next(error)
    }
})
.post(reviewsBodyValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, { errors }))
        const reviews = await getReviews()
        const newReview = {
            id: uniqid(),
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        reviews.push(newReview)
        await writeReview(reviews)
        res.status(201).send(newReview)    
    } catch (error) {
        next(error)
    }
})

reviewsRouter.route('/:reviewId')
.put(async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const index = reviews.findIndex(review => review.id === req.params.reviewId)
        if (index === -1) return next(createHttpError(404, `Review With ID ${req.params.reviewId} Not Found.`))
        reviews[index] = {
            ...reviews[index],
            ...req.body,
            updatedAt: new Date()
        }
        await writeReview(reviews)
        res.send(reviews[index])    
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        const reviews = await getReviews()
        const remainingReviews = reviews.filter(review => review.id !== req.params.reviewId)
        await writeReview(remainingReviews)
        res.status(204).send()    
    } catch (error) {
        next(error)
    }
})

export default reviewsRouter