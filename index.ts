import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as command from "@pulumi/command";

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

let output: pulumi.Output<any>;

const ls = new command.local.Command('ls-command' + String(two), {
    create: 'ls',
});

if (one < 10) {
  const inner = new pulumi.Program("s", {
    source: ".",
    inputs: {
      numberOne: one,
      numberTwo: two,
    },
  }, { dependsOn: [ls] });
    output = pulumi.output(inner.outputs.apply((x: any) => [two].concat(x.fibonacci)));
} else {
  output = pulumi.output([two]);
}

export const fibonacci = output;
