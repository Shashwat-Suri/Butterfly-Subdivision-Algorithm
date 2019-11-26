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
      m = new Mesh();
      m.copyMesh(this.meshes[this.meshes.length-1]);

      //set all vertices to not-new
      m.getVertices().forEach(v => {
        v.setNew(false);
      })

      //set all edges to not-split
      m.getEdges().forEach(e => {
        e.setSplit(false);
      })


      while (m.SplitsLeft()){
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

      m.computeNormal();



      //

      this.meshes.push(m);
    }

    this.splitEdge = function(he,mesh){
      vert1 = he.getOrigin();
      vert2 = he.getTwin().getOrigin();
      vadd = vert1.getPos().add(vert2.getPos());
      v = mesh.addVertexPos(vadd.getPos().x/2,vadd.getPos().y/2,vadd.getPos().z/2,4);
      v.setNew(true);
      nhe = mesh.addHalfEdge();
      nhetwin = mesh.addHalfEdge();
      nhe.setTwin(nhetwin);
      nhetwin.setTwin(nhe);
      he.setOrigin(v);
      he.setPrev(nhe);
      he.getTwin().setNext(nhetwin);
      he.setSplit(true);
      he.getTwin().setSplit(true);
      nhe.setSplit(true);
      nhetwin.setSplit(true);

    }

    this.cutACorner = function(f,mesh){

    }

    return this;
}
