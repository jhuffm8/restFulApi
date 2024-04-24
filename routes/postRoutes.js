const express = require('express')

const router = express.Router()

const posts = require("../data/posts");

router.get('/api/posts/userId/:id', (req, res) => {
    const post = posts.filter(p => p.userId == req.params.id)
    console.log(post)
    res.json(post)
});
router.get('/api/posts', (req, res) => {
    let userId = req.query['userId'];
    const post = posts.filter(p => p.userId == userId)
    res.json(post)
    if(userId == res.json(post.userId)){
        res.json(post)
    } 
});



router
    .route('/api/posts')
    .get( (req, res) => {
        res.json(posts)

    })
    .post((req, res) => {
        if (req.body.userId && req.body.title && req.body.content) {
            const post = {
              id: posts[posts.length - 1].id + 1,
              userId: req.body.userId,
              title: req.body.title,
              content: req.body.content,
            };
      
            posts.push(post);
            res.json(posts[posts.length - 1]);
          } else res.json({ error: "Insufficient Data" });
        });
router
    .route('/api/posts/:id')
    .get((req, res, next) => {
    const post =  posts.find((p) => p.id == req.params.id)
    if(post){
        res.json(post)
    } else {
        next()
    }
    })
    .patch((req, res) => {
    // Within the PATCH request route, we allow the client
    // to make changes to an existing post in the database.
        const post = posts.find((p, i) => {
            if (p.id == req.params.id) {
            for (const key in req.body) {
                posts[i][key] = req.body[key];
            }
            return true;
            }
        });
        if (post) res.json(post);
        else next();

    })
    .delete((req, res) => {
          // The DELETE request route simply removes a resource.
         const post = posts.find((p, i) => {
             if (p.id == req.params.id) {
              posts.splice(i, 1);
             return true;
        }
      });
  
      if (post) res.json(post);
      else next();
        
    });



module.exports = router