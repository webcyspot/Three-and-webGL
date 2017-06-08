#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$DIR/setup_test_env.bash"

blender --background $BLEND/cubeB.blend --python $PYSCRIPT -- \
    $JSON --vertices --faces --colors --faceMaterials --mixColors --geometryType Geometry
makereview $@ --tag $(tagname)
