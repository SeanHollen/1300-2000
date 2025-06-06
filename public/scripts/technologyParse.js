class Technologies {
  constructor(obj) {
    this.nodes = {};
    obj.nodes.forEach((node) => {
      this.nodes[node.title] = node;
    });
    this.edges = {};
    obj.links.forEach((link) => {
      if (!this.edges[link.source]) this.edges[link.source] = [];
      this.edges[link.source].push(link.target);
    });
  }

  calculateInfluence(techName) {
    const techId = this.nodes[techName].id;
    let count = 0;
    const seen = new Set();
    const queue = [...(this.edges[techId] || [])];
    while (queue.length > 0) {
      const currentTechId = queue.shift();
      if (seen.has(currentTechId)) continue;
      seen.add(currentTechId);
      count++;
      const children = this.edges[currentTechId] || [];
      queue.push(...children);
    }
    return count;
  }

  calculateAllInfluence() {
    this.influences = [];
    Object.keys(this.nodes).forEach((techName) => {
      const influence = this.calculateInfluence(techName);
      this.influences.push({
        techName: techName,
        influence: influence,
        object: this.nodes[techName],
      });
    });
    this.influences.sort((a, b) => b.influence - a.influence);
  }

  getTechMap() {
    return this.techMap;
  }

  getInfluences() {
    return this.influences;
  }
}

export default Technologies;