# tfjs-data-generator-sample
Sample code for tf.data.generator and fitDataset() of tensorflow.js

# Who needs this?
This is for someone who has large training dataset and that dataset doesn't fit entirely in memory.

# How to Use
Needs 3steps to see how it works
```
$ tsc
$ node dist/create-datafiles.js
$ node dist/index.js
```
1. Build this typescript source
2. create test dataset files
3. build model and learn with `tf.data.generator` and `fitDataSet()`

# Sample exercise for TensorFlow
Regression model to predict 1 value given 4 arguments value.  
This value is caluculated by simple function, named `hiddenCalc()`
