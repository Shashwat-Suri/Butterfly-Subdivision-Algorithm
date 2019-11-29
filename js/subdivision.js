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

      this.positionSetter(m.getVertices(),m);


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

    this.positionSetter = function(vertices, old_mesh){
      this.positionVert = function(vert){
        if(!vert.isNew){
          return;
        }

        while(vert.getEdge().next.origin.getNew()){
          vert.setEdge(vert.goClockwise1());
        }

        origEdge = vert.getEdge()
        origEdgeTwin = origEdge.getTwin()

        topVert = origEdge.next.goStraight1().next.origin
        bottomVert = origEdgeTwin.goStraight1().next.goStraight1().next.origin;

        topRight = origEdge.twin.goClockwise1().goClockwise1().goStraight1().next.origin;
        topLeft = origEdge.goBack1().goAnticlowise1().goAnticlowise1().goStraight1().next.origin;

        bottomRight = origEdgeTwin.goAnticlowise1().goAnticlowise1().goStraight1().next.origin;
        bottomLeft = origEdge.goBack1().goClockwise1().goClockwise1().goStraight1().next.origin;

        Left = origEdge.goBack1().origin;
        Right = origEdgeTwin.origin

        var sum = new Vector3D(0,0,0)
        //console.log(sum.value);

        sum = sum.add(topVert.getPos().multiply(2/16));
        sum = sum.add(bottomVert.getPos().multiply(2/16));
        sum = sum.subtract(topRight.getPos().multiply(1/16));
        sum = sum.subtract(topLeft.getPos().multiply(1/16));
        sum = sum.subtract(bottomRight.getPos().multiply(1/16));
        sum = sum.subtract(bottomLeft.getPos().multiply(1/16));
        sum = sum.add(Left.getPos().multiply(8/16));
        sum = sum.add(Right.getPos().multiply(8/16));
        vert.setPos(sum.x(), sum.y(), sum.z());
        //vert.isNew = false;

      }

      old_verts = old_mesh.getVertices();
      for(j = 0; j < old_verts.length; j++){
        this.positionVert(old_verts[j]);
      }

  }

    return this;
}
