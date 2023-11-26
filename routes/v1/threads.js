var express = require('express');
var router = express.Router();
const ThreadModel = require('../../database/models/Thread');
const {validateUser} = require('./middlewares/users')
const logger = require('../../logger')

router.get('/:thread_id', validateUser, async (req, res) => {
  const {userId} = req
  const {thread_id} = req.params

  try {
    const thread = await ThreadModel.findOne({user: userId, _id: thread_id}).select(['messages', 'title', 'tags'])
    if (!thread) {
      return res.status(404)
      .json({
        success: false,
        message: 'Thread could not be found'
      })
    }
    return res.status(200)
    .json({
      success: true,
      message: 'Thread found',
      data: {
        thread
      }
    })
  } catch (err) {
    logger.error(err)
    return res.status(500)
    .json({
      success: false,
      message: 'Could not find thread',
      
    })
  }
})

// Get all threads title
router.get('/', validateUser, async (req, res) => {
  const {userId} = req
  const {attribute} = req.query

  switch (attribute) {
    case 'title':
      const allThreadTitle = await ThreadModel.find({user: userId}).select(['title', 'id']);

      return res.status(200).json({
        success: true,
        message: 'Threads found.',
        data: {
          threads: allThreadTitle
        }
      })

    default:
      return res.status(400).json({
        success: false,
        message: 'No thread attribute in request url'
      })
  }

})

router.post('/', validateUser, async (req, res) => {
  const {userId} = req
  try {
    const thread = await ThreadModel.create({
      user: userId
    })

    return res.status(201)
    .json({
      success: true,
      message: 'Thread created successfully',
      data: {
        thread_id: thread.id
      }
    })

  } catch (err) {
    logger.error(err);
    res.status(500)
    .json({
      success: false,
      messae: 'A new thread could not be created'
    })
  }
})


module.exports = router