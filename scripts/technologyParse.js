class Technologies {
  constructor(obj) {
    this.nodes = {};
    obj.nodes.forEach(node => {
      this.nodes[node.title] = node;
    });
    this.edges = {};
    obj.links.forEach(link => {
      if (!this.edges[link.source]) this.edges[link.source] = [];
      this.edges[link.source].push(link.target);
    });
  }

  calculateInfluence(techName) {
    const techId = this.nodes[techName].id;
    let count = 0;
    const seen = new Set();
    const queue = this.edges[techId];
    if (!queue) return 0;
    while (queue.length > 0) {
      const currentTechId = queue.shift();
      if (seen.has(currentTechId)) continue;
      seen.add(currentTechId);
      count++;
      queue.push(...(this.edges[currentTechId] || []));
    }
    return count;
  }

  getTechMap() {
    return this.techMap;
  }
  
}

export default Technologies;