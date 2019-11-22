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

        return NULL; // REPLACE THIS!
        
        //@@@@@
        // YOUR CODE HERE
        //@@@@@ 
    }

    this.clear = function (m) {
        this.meshes = [];
    }
}