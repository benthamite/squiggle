import { testRun } from "../helpers/helpers.js";
import {
  MySkip,
  testEvalToBe,
  testToExpression,
} from "../helpers/reducerHelpers.js";

describe("Symbolic constructors", () => {
  describe("normal constructor", () => {
    testEvalToBe("Dist.normal(5,2)", "Normal(5,2)");
    testEvalToBe("normal(5,2)", "Normal(5,2)");

    testEvalToBe("normal({mean:5,stdev:2})", "Normal(5,2)");

    testEvalToBe("-2 to 4", "Normal(1,1.8238704957353071)");
    testEvalToBe("to(-2,2)", "Normal(0,1.2159136638235382)");
    testEvalToBe(
      "4 to -2",
      "Error(Error: Low value must be less than high value)"
    );

    testEvalToBe("normal({p5: -2, p95: 4})", "Normal(1,1.8238704957353071)");
    expect(testRun("normal({p5: -2, p95: 4}) -> inv(0.05)").value).toBeCloseTo(
      -2
    );
    expect(testRun("normal({p5: -2, p95: 4}) -> inv(0.95)").value).toBeCloseTo(
      4
    );

    testEvalToBe("normal({p10: -2, p90: 4})", "Normal(1,2.3409124382171367)");
    expect(testRun("normal({p10: -2, p90: 4}) -> inv(0.1)").value).toBeCloseTo(
      -2
    );
    expect(testRun("normal({p10: -2, p90: 4}) -> inv(0.9)").value).toBeCloseTo(
      4
    );

    testEvalToBe("normal({p25: -2, p75: 4})", "Normal(1,4.447806655516805)");
    expect(testRun("normal({p25: -2, p75: 4}) -> inv(0.25)").value).toBeCloseTo(
      -2
    );
    expect(testRun("normal({p25: -2, p75: 4}) -> inv(0.75)").value).toBeCloseTo(
      4
    );
  });

  describe("lognormal constructor", () => {
    testEvalToBe("lognormal(5,2)", "Lognormal(5,2)");

    testEvalToBe(
      "to(2,5)",
      "Lognormal(1.1512925464970227,0.27853260523016377)"
    );

    testEvalToBe(
      "lognormal({p5: 2, p95: 5})",
      "Lognormal(1.1512925464970227,0.27853260523016377)"
    );
    expect(
      testRun("lognormal({p5: 2, p95: 5}) -> inv(0.05)").value
    ).toBeCloseTo(2);
    expect(
      testRun("lognormal({p5: 2, p95: 5}) -> inv(0.95)").value
    ).toBeCloseTo(5);

    testEvalToBe(
      "lognormal({p10: 2, p90: 5})",
      "Lognormal(1.1512925464970227,0.3574927285445488)"
    );
    expect(
      testRun("lognormal({p10: 2, p90: 5}) -> inv(0.1)").value
    ).toBeCloseTo(2);
    expect(
      testRun("lognormal({p10: 2, p90: 5}) -> inv(0.9)").value
    ).toBeCloseTo(5);

    testEvalToBe(
      "lognormal({p25: 2, p75: 5})",
      "Lognormal(1.1512925464970227,0.6792473359363719)"
    );
    expect(
      testRun("lognormal({p25: 2, p75: 5}) -> inv(0.25)").value
    ).toBeCloseTo(2);
    expect(
      testRun("lognormal({p25: 2, p75: 5}) -> inv(0.75)").value
    ).toBeCloseTo(5);
  });

  testEvalToBe("pointMass(5)", "PointMass(5)");
});

describe("eval on distribution functions", () => {
  describe("unaryMinus", () => {
    testEvalToBe("mean(-normal(5,2))", "-5");
    testEvalToBe("-normal(5,2)", "Normal(-5,2)");
  });
  describe("mean", () => {
    testEvalToBe("mean(normal(5,2))", "5");
    testEvalToBe("mean(lognormal(1,2))", "20.085536923187668");
    testEvalToBe("mean(gamma(5,5))", "25");
    testEvalToBe("mean(bernoulli(0.2))", "0.2");
    testEvalToBe("mean(bernoulli(0.8))", "0.8");
    testEvalToBe("mean(logistic(5,1))", "5");
  });
  describe("stdev", () => {
    testEvalToBe("stdev(normal(5,2))", "2");
    testEvalToBe("stdev(lognormal(1,2))", "147.04773715128695");
    testEvalToBe("stdev(gamma(5,5))", "11.180339887498949");
    testEvalToBe("stdev(bernoulli(0.2))", "0.4");
    testEvalToBe("stdev(bernoulli(0.8))", "0.39999999999999997");
    testEvalToBe("stdev(logistic(5,1))", "1.8137993642342178");
  });
  describe("toString", () => {
    testEvalToBe("toString(normal(5,2))", "'Normal(5,2)'");
  });
  describe("normalize", () => {
    testEvalToBe("normalize(normal(5,2))", "Normal(5,2)");
  });
  describe("add", () => {
    testEvalToBe(
      "add(normal(5,2), normal(10,2))",
      "Normal(15,2.8284271247461903)"
    );
    testEvalToBe(
      "add(normal(5,2), lognormal(10,2))",
      "Sample Set Distribution"
    );
    testEvalToBe("add(normal(5,2), 3)", "Normal(8,2)");
    testEvalToBe("add(3, normal(5,2))", "Normal(8,2)");
    testEvalToBe("3+normal(5,2)", "Normal(8,2)");
    testEvalToBe("normal(5,2)+3", "Normal(8,2)");
  });
  describe("subtract", () => {
    testEvalToBe("10 - normal(5, 1)", "Normal(5,1)");
    testEvalToBe("normal(5, 1) - 10", "Normal(-5,1)");
    testEvalToBe("mean(1 - toPointSet(normal(5, 2)))", "-4.002309896304692");
  });
  describe("multiply", () => {
    testEvalToBe("normal(10, 2) * 2", "Normal(20,4)");
    testEvalToBe("normal(10, 2) * 0", "PointMass(0)");
    testEvalToBe("0 * normal(10, 2)", "PointMass(0)");
    testEvalToBe("2 * normal(10, 2)", "Normal(20,4)");
    testEvalToBe(
      "lognormal(5,2) * lognormal(10,2)",
      "Lognormal(15,2.8284271247461903)"
    );
    testEvalToBe(
      "lognormal(10, 2) * lognormal(5, 2)",
      "Lognormal(15,2.8284271247461903)"
    );
    testEvalToBe("2 * lognormal(5, 2)", "Lognormal(5.693147180559945,2)");
    testEvalToBe("lognormal(5, 2) * 2", "Lognormal(5.693147180559945,2)");
  });
  describe("division", () => {
    testEvalToBe(
      "lognormal(5,2) / lognormal(10,2)",
      "Lognormal(-5,2.8284271247461903)"
    );
    testEvalToBe(
      "lognormal(10,2) / lognormal(5,2)",
      "Lognormal(5,2.8284271247461903)"
    );
    testEvalToBe("lognormal(5, 2) / 2", "Lognormal(4.306852819440055,2)");
    testEvalToBe("2 / lognormal(5, 2)", "Lognormal(-4.306852819440055,2)");
    testEvalToBe("2 / normal(10, 2)", "Sample Set Distribution");
    testEvalToBe("normal(10, 2) / 2", "Normal(5,1)");
  });
  describe("truncate", () => {
    testEvalToBe("truncateLeft(normal(5,2), 3)", "Point Set Distribution");
    testEvalToBe("truncateRight(normal(5,2), 3)", "Point Set Distribution");
    testEvalToBe("truncate(normal(5,2), 3, 8)", "Point Set Distribution");
    testEvalToBe(
      "truncate(normal(5,2) |> SampleSet.fromDist, 3, 8)",
      "Sample Set Distribution"
    );
    testEvalToBe("isNormalized(truncate(normal(5,2), 3, 8))", "true");
  });

  describe("exp", () => {
    testEvalToBe("exp(normal(5,2))", "Sample Set Distribution");
  });

  describe("pow", () => {
    testEvalToBe("pow(3, uniform(5,8))", "Sample Set Distribution");
    testEvalToBe("pow(uniform(5,8), 3)", "Sample Set Distribution");
    testEvalToBe(
      "pow(uniform(5,8), uniform(9, 10))",
      "Sample Set Distribution"
    );
  });

  describe("log", () => {
    testEvalToBe("log(2, uniform(5,8))", "Sample Set Distribution");
    testEvalToBe(
      "log(normal(5,2), 3)",
      "Error(Distribution Math Error: Logarithm of input error: First input must be completely greater than 0)"
    );
    testEvalToBe(
      "log(normal(5,2), normal(10,1))",
      "Error(Distribution Math Error: Logarithm of input error: First input must be completely greater than 0)"
    );
    testEvalToBe(
      "log(2, SampleSet.fromDist(0.0001 to 5))",
      "Sample Set Distribution"
    ); // log with low values, see https://github.com/quantified-uncertainty/squiggle/issues/1098
    testEvalToBe("log(uniform(5,8))", "Sample Set Distribution");
    testEvalToBe("log10(uniform(5,8))", "Sample Set Distribution");
  });

  describe("dotAdd", () => {
    testEvalToBe(
      "dotAdd(normal(5,2), lognormal(10,2))",
      "Point Set Distribution"
    );
    testEvalToBe("dotAdd(normal(5,2), 3)", "Point Set Distribution");
  });

  describe("equality", () => {
    MySkip.testEvalToBe("normal(5,2) == normal(5,2)", "true");
  });

  describe("mixture", () => {
    testEvalToBe(
      "mx(normal(5,2), normal(10,1), normal(15, 1))",
      "Point Set Distribution"
    );
    testEvalToBe(
      "mixture(normal(5,2), normal(10,1), [0.2, 0.4])",
      "Point Set Distribution"
    );
  });
});

describe("parse on distribution functions", () => {
  describe("power", () => {
    testToExpression(
      "normal(5,2) ^ normal(5,1)",
      "(pow)((normal)(5, 2), (normal)(5, 1))"
    );
    testToExpression("3 ^ normal(5,1)", "(pow)(3, (normal)(5, 1))");
    testToExpression("normal(5,2) ^ 3", "(pow)((normal)(5, 2), 3)");
  });
  describe("subtraction", () => {
    testToExpression("10 - normal(5,1)", "(subtract)(10, (normal)(5, 1))");
    testToExpression("normal(5,1) - 10", "(subtract)((normal)(5, 1), 10)");
  });
  describe("pointwise arithmetic expressions", () => {
    MySkip.testParse(
      "normal(5,2) .+ normal(5,1)",
      "(:dotAdd (:normal 5 2) (:normal 5 1))"
    );
    MySkip.testParse(
      "normal(5,2) .- normal(5,1)",
      "(:$$_block_$$ (:dotSubtract (:normal 5 2) (:normal 5 1)))"
      // TODO: !!! returns "{(:dotPow (:normal 5 2) (:normal 5 1))}"
    );
    testToExpression(
      "normal(5,2) .* normal(5,1)",
      "(dotMultiply)((normal)(5, 2), (normal)(5, 1))"
    );
    testToExpression(
      "normal(5,2) ./ normal(5,1)",
      "(dotDivide)((normal)(5, 2), (normal)(5, 1))"
    );
    testToExpression(
      "normal(5,2) .^ normal(5,1)",
      "(dotPow)((normal)(5, 2), (normal)(5, 1))"
    );
  });
  describe("equality", () => {
    testToExpression("5 == normal(5,2)", "(equal)(5, (normal)(5, 2))");
  });
  describe("pointwise adding two normals", () => {
    MySkip.testParse(
      "normal(5,2) .+ normal(5,1)",
      "(:dotAdd (:normal 5 2) (:normal 5 1))"
    );
  });
  describe("exponential of one distribution", () => {
    MySkip.testParse("exp(normal(5,2)", "(:pow (:normal 5 2) 3)");
  });
});
