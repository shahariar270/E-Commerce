

class comment_controls {
    async comment_create(req, res) {
        try {
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                success: false,
            })
        }
    }
}

module.exports = new comment_controls();