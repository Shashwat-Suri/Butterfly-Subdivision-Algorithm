function subdivider (input_mesh) {
    this.meshes = [];
    this.meshes.push(input_mesh);

    this.subdivide = function (level) {
        console.log("mesh length:"+meshes.length);
        console.log("level:" +level);
        while(level>=this.meshes.length){
          subIncrease();
        }

        console.log("vertices:" + meshes[level].getVertices().length);
        console.log("edges:"+meshes[level].getEdges().length/2);
        console.log("faces:"+meshes[level].getFaces().length);
        return this.meshes[level];
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

      origEdgeLength = m.getEdges().length;
      for(j = 0; j < origEdgeLength; j++){
        this.splitEdge(m.getEdges()[j],m);
      }

      m.getEdges().forEach(e=>{
        if(!e.getIsSplit()){
          this.splitEdge(e,m);
        }
      });

      origFaceLength = m.getFaces().length;
      for(j = 0; j<origFaceLength; j++){
        this.cutACorner(m.getFaces()[j],m);
      }

      m.computeNormal()
      this.meshes.push(m);
    }


    this.splitEdge = function(he,mesh){
      if(he.getIsSplit()){
        return;
      }
      l=mesh.getVertices().length;
      vert1 = he.getOrigin();
      vert2 = he.getNext().getOrigin();
      vadd = vert1.getPos().add(vert2.getPos());
      v = mesh.addVertexPos(
        vadd.x()/2,
        vadd.y()/2,
        vadd.z()/2,
        l);
      v.setEdge(he);
      he.setOrigin(v);
      v.setNew(true);


      nhe = mesh.addEdge(vert1,v);
      nhetwin = mesh.addEdge(v,vert1);

      pEdge = he.getPrev();

      he.setPrev(nhe);
      nhe.setNext(he);

      pEdge.setNext(nhe)
      nhe.setPrev(pEdge);

      nhetwin.setNext(he.getTwin().getNext());
      he.getTwin().getNext().setPrev(nhetwin);

      he.getTwin().setNext(nhetwin)
      nhetwin.setPrev(he.getTwin())

      he.setIsSplit(true);
      he.getTwin().setIsSplit(true);
      nhe.setIsSplit(true);
      nhetwin.setIsSplit(true);



    }
    this.cutACorner = function(f,mesh){
      while(!f.isTriangle()){
        while(!(f.getEdge().getOrigin().getNew() || f.getEdge().getNext().getNext().getOrigin().getNew())){
          console.log("loop")
          f.setEdge(f.getEdge().getNext())
        }
          v1 = f.getEdge().getOrigin();
          v2 = f.getEdge().getNext().getOrigin();
          v3 = f.getEdge().getNext().getNext().getOrigin();

          nhe = mesh.addEdge(v3,v1);
          nhe.setIsSplit(true);
          nhe.setPrev(f.getEdge().getNext());
          nhe.setNext(f.getEdge());

          nhetwin = mesh.addEdge(v1,v3);
          nhetwin.setIsSplit(true);
          nhetwin.setPrev(f.getEdge().getPrev());
          nhetwin.setNext(f.getEdge().getNext().getNext());
          nhetwin.setFace(f);

          f.getEdge().getPrev().setNext(nhetwin);
          f.getEdge().getNext().getNext().setPrev(nhetwin);

          f.getEdge().setPrev(nhe);
          f.getEdge().getNext().setNext(nhe);

          mesh.addFaceByVerts(v1,v2,v3);
          f.setEdge(nhetwin.getNext().getNext());
      }
    }

    return this;
}
