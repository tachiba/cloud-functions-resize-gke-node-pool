/* SEE: https://cloud.google.com/scheduler/docs/start-and-stop-compute-engine-instances-on-a-schedule */

const Buffer = require("safe-buffer").Buffer;
const container = require("@google-cloud/container");
const client = new container.v1.ClusterManagerClient();

exports.resizeGKENodePool = async (data) => {
  const payload = JSON.parse(Buffer.from(data.data, "base64").toString());

  const request = {
    projectId:  process.env.GCLOUD_PROJECT,
    zone:       payload.zone,
    clusterId:  payload.cluster_id,
    nodePoolId: payload.node_pool_id,
    nodeCount:  payload.node_count,
  };

  const result = await client.setNodePoolSize(request);
  const operation = result[0];

  console.log(operation);
};
