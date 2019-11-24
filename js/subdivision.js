function subdivider (input_mesh) {
    this.meshes = [];

    // Initializes this subdivision object with a mesh to use as
    // the control mesh (ie: subdivision level 0).
    this.meshes.push(input_mesh);

    this.subdivide = function (level) {
        // Subdivides the control mesh to the given subdivision level.
        // Returns the subdivided mesh.

        // HINT: Create a new subdivision mesh for each subdivision level and
        // store it in memory for later.
        // If the calling code asks for a level that has already been computed,
        // just return the pre-computed mesh!

        while(level>=this.meshes.length){
          this.subInc();
        }

        return meshes[level];
         // REPLACE THIS!
        //@@@@@
        // YOUR CODE HERE
        //@@@@@
    }

    this.clear = function (m) {
        this.meshes = [];
    }

    this.subInc = function(){
      m = this.meshes[this.meshes.length-1];

      //make changes to m
      m.getVertices().forEach(v => {
        v.setNew(false);
      })
      // for (lev in m.getVertices()){
      //   console.log(m.getVertices());
      //   console.log(typeof v);
      //   console.log("setting vertices to old")
      //   v.setNew(false);
      // }
      m.getEdges().forEach(e => {
        e.setSplit(false);
      })
      // for (he in m.getEdges()){
      //   console.log("setting edges to not-split")
      //   he.setSplit(false);
      // }

      while (m.isSplits()){
        for(e in m.getEdges()){
          if(e.getIsSplit() == false){
            console.log("splitting edge");
            this.splitEdge(e,m);
          }
        }
      }

      while (m.isNonTriangles()){
        for(f in m.getFaces()){
          if(f.notTriangle()){
            console.log("cutting a corner");
            this.cutACorner(f,m);
          }
        }
      }



      //

      this.meshes.push(m);
    }

    this.splitEdge = function(he,mesh){

    }

    this.cutACorner = function(f,mesh){

    }

    return this;
}
