const errorHandler = (err, req, res, next) => {
    switch (err.status) {
        case 400:
            res.status(400).send(err.errors)
            break;
        case 404: 
            res.status(404).send(err.message)
            break;
        default: 
            res.status(500).send('Server Error')
    }
}

export default errorHandler