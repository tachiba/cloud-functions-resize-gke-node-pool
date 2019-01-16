/* SEE: https://cloud.google.com/scheduler/docs/start-and-stop-compute-engine-instances-on-a-schedule */

const Buffer = require("safe-buffer").Buffer;
const container = require("@google-cloud/container");
const client = new container.v1.ClusterManagerClient({
  projectId: process.env.GCLOUD_PROJECT,
});

exports.resizeGKECluster = async (event) => {
  try {
    const pubsubMessage = event.data;
    const payload = JSON.parse(Buffer.from(pubsubMessage.data, 'base64').toString());

    const request = {
      zone:       payload.zone,
      clusterId:  payload.cluster_id,
      nodePoolId: payload.node_pool_id,
      nodeCount:  payload.node_count,
    };

    await client.setNodePoolSize(request)
      .then(data => {
        // Operation pending.
        const operation = data[0];
        return operation.promise();
      });
  } catch (err) {
    console.log(err);
  }
};
