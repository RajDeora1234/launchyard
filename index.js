const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
const cors = require("cors");

const app = express();
const PORT = 9000;

app.use(cors());

const ecsClient = new ECSClient({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.use(express.json());


app.post("/project", async (req, res) => {
  const { gitURL, slug } = req.body;
  const projectSlug = slug? slug:generateSlug();

  const command = new RunTaskCommand({
    cluster: process.env.CLUSTER,
    taskDefinition: process.env.TASK,
    launchType: "FARGATE",
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: "ENABLED",
        subnets: [
          "subnet-042961bb5cd64e060",
          "subnet-0b976b264d7430f98",
          "subnet-0c8c8929c7fb10165",
        ],
        securityGroups: ["sg-00e083519eeb35a9b"],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "builder-image",
          environment: [
            { name: "GIT_REPOSITORY__URL", value: gitURL },
            { name: "PROJECT_ID", value: projectSlug },
          ],
        },
      ],
    },
  });
  await ecsClient.send(command);
  return res.json({
    status: "Queued",
    data: {
      projectSlug,
      url: `http://${projectSlug}.localhost:8000`,
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
