import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
let one = config.getNumber("numberOne");
let two = config.getNumber("numberTwo");

if (one === undefined || two === undefined) {
  one = 0;
  two = 1;
} else {
  const temp = one;
  one = two;
  two = temp + two;
}

let output1: pulumi.Output<any>;
let output2: pulumi.Output<any>;

if (one < 10) {
  const inner = new pulumi.Program("s", {
    source: ".",
    inputs: {
      numberOne: one,
      numberTwo: two,
    },
  });
  output1 = inner.outputs.numberOne;
  output2 = inner.outputs.numberTwo;
  let bucket = new aws.s3.Bucket("b" + String(one), {}, { dependsOn: [inner] });
} else {
  output1 = pulumi.output(one);
  output2 = pulumi.output(two);
}

export const numberOne = output1;
export const numberTwo = output2;
