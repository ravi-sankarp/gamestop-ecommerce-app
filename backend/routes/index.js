import express from 'express';

const router = express.Router();



/* GET home page. */
router.get('/', (_req, res)=> {
  res.status(200).json({success:'success'});
});

export default router;
 