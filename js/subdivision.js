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
        console.log("mesh length:"+meshes.length);
        console.log("level:" +level);
        while(level>=this.meshes.length){
          subIncrease();
        }

        console.log("vertices:" + meshes[level].getVertices().length);
        console.log("edges:"+meshes[level].getEdges().length/2);
        console.log("faces:"+meshes[level].getFaces().length);
        return meshes[level];
         // REPLACE THIS!
        //@@@@@
        // YOUR CODE HERE
        //@@@@@
    }

    this.clear = function (m) {
        this.meshes = [];
    }

    this.subIncrease = function(){
      m = new Mesh()
      m.copyMesh(this.meshes[this.meshes.length-1])

      //set all vertices to not-new
      m.getVertices().forEach(v => {
        v.setNew(false);
      })

      //set all edges to not-split
      m.getEdges().forEach(e => {
        e.setIsSplit(false);
      })

      while (m.SplitsLeft() === true){
        m.getEdges().forEach(e=>{
          if(e.getIsSplit() === false){
            this.splitEdge(e,m);
          }
        });
      }

      while (m.isNonTriangles()){
        m.getFaces().forEach(f=>{
          if(f.notTriangle()){
            this.cutACorner(f,m);
          }
        })
      }
      m.computeNormal()
      this.meshes.push(m);
    }

    this.splitEdge = function(he,mesh){
      vert1 = he.getOrigin();
      vert2 = he.getTwin().getOrigin();
      vadd = vert1.getPos().add(vert2.getPos());
      var v = mesh.addVertexPos(
        vadd.x()/2,
        vadd.y()/2,
        vadd.z()/2,
        mesh.getVertices().length)
      v.setNew(true);

      nhe = mesh.addEdge(vert2,v);
      nhe.setPrev(he.getPrev());
      nhe.setNext(he);
      nhe.setFace(he.getFace());
      nhe.setIsSplit(true);

      nhetwin = mesh.addEdge(v,vert2);
      nhetwin.setPrev(he.getTwin());
      nhetwin.setNext(he.getTwin().getNext());
      nhetwin.setFace(he.getTwin().getFace());
      nhetwin.setIsSplit(true);

      he.setOrigin(v);
      he.setPrev(nhe);
      he.setIsSplit(true);

      he.getTwin().setNext(nhetwin);
      he.getTwin().setIsSplit(true);
    }



    this.cutACorner = function(f,mesh){
          while(!(f.getEdge().getOrigin().getNew() ){
                console.log("loop")
            f.setEdge(f.getEdge().getNext())
          }

          v1 = f.getEdge().getOrigin();
          v2 = f.getEdge().getNext().getOrigin();
          v3 = f.getEdge().getNext().getNext().getOrigin();

          nhe = mesh.addEdge(v3,v1);
          nhe.setIsSplit(true);

          nhetwin = mesh.addEdge(v1,v3);
          nhetwin.setIsSplit(true);

          mesh.addFaceByVerts(v,v1,v2);
          f.setEdge(nhetwin);

    }

    return this;
}
