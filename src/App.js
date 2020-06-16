import React from "react";
import axios from "axios";
import "./App.scss";

class PlayerCard extends React.Component {
  render() {
    const { results } = this.props;

    const profileImage = this.props.playerData.avatar_url
      ? {
          backgroundImage: "url(" + this.props.playerData.avatar_url + ")",
          backgroundSize: "contain",
        }
      : { backgroundImage: "#b2ffe6", backgroundSize: "contain" };

    return (
      <div className="playerCard">
        <div className="card-content">
          <div
            className="profile-image"
            style={
              profileImage
              // background: "url(" + this.props.playerData.avatar_url + ")",
            }
          ></div>
          <h2>Player</h2>
          <div className="war-result">
            <div>
              <span>Forks</span>
              {this.props.playerData.name}
            </div>
            <div>
              <span>Repositories</span>
              {this.props.playerData.public_repos}
            </div>
            <div>
              <span>Total STARS</span>
              {this.props.stars}
            </div>
          </div>
          <label>
            GITHUB USERNAME
            <br />
            <input
              type="text"
              name="username"
              placeholder="search..."
              value={this.props.value}
              onChange={this.props.query}
              autoComplete="off"
            />
            <ul>
              {results.length
                ? results.map((item) => (
                    <li key={item.id} onClick={this.props.setPlayer}>
                      {item.login}
                    </li>
                  ))
                : ""}
            </ul>
          </label>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    query1: "",
    query2: "",
    player1: "",
    player2: "",
    results1: {},
    results2: {},
    player1res: {},
    player2res: {},
    stars1: 0,
    stars2: 0,
  };

  cancel = "";

  getInput1 = (ev) => {
    const query = ev.target.value;
    this.setState({ query1: query }, () => {
      this.fetchSearchResults(query, 1);
    });
  };
  getInput2 = (ev) => {
    const query = ev.target.value;
    this.setState({ query2: query }, () => {
      this.fetchSearchResults(query, 2);
    });
  };

  setPlayer1 = (ev) => {
    const player = ev.currentTarget.textContent;
    this.setState({ player1: player, query1: player });
  };

  setPlayer2 = (ev) => {
    const player = ev.currentTarget.textContent;
    console.log(player);
    this.setState({ player2: player, query2: player });
  };

  fetchSearchResults = (query, num) => {
    const searchUrl = `https://api.github.com/search/users?q=${query}&page=1&per_page=4`;

    if (this.cancel) this.cancel.cancel();

    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, { cancelToken: this.cancel.token })
      .then((res) => {
        const results = res.data.items;
        this.setState({ results1: "" });
        this.setState({ results2: "" });
        num === 1
          ? this.setState({ results1: results })
          : this.setState({ results2: results });
      })
      .catch((error) => {
        if (axios.isCancel(error) || error) {
          // this.setState({
          //   loading: false,
          //   message: "Failed to fetch results.Please check network",
          // });
          console.log(error, "no network");
        }
      });
  };

  fetchUser = (username, num) => {
    const searchUrl = `https://api.github.com/users/${username}`;

    if (this.cancel) this.cancel.cancel();

    this.cancel = axios.CancelToken.source();

    axios
      .get(searchUrl, { cancelToken: this.cancel.token })
      .then((res) => {
        const userData = res.data;
        num === 1
          ? this.setState({ player1res: userData })
          : this.setState({ player2res: userData });

        this.setState({ player1res: res.data });
      })
      .catch((err) => console.log(err));
  };

  fetchStarred = (username, num) => {
    const searchUrl = `https://api.github.com/users/${username}/starred`;
    console.log(searchUrl);

    axios.get(searchUrl).then((res) => {
      const length = res.data.length;
      num === 1
        ? this.setState({ stars1: length })
        : this.setState({ stars2: length });
    });
  };

  start = () => {
    const player1 = this.state.player1;
    const player2 = this.state.player2;
    // if (player1) {
    const p1data = this.fetchUser(player1, 1);
    this.fetchStarred(player1, 1);
    // }
    // const p2data = this.fetchUser(player2);
    // console.log(p)
    // this.setState({player1res: p1data})
    // this.setState({player2res: p2data})
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <a href={App} className="logo">
            ./Github<span>Wars</span>
          </a> */}
          <div className="container">
            <div className="arena">
              <PlayerCard
                setPlayer={this.setPlayer1}
                query={this.getInput1}
                value={this.state.query1}
                results={this.state.results1}
                playerData={this.state.player1res}
                stars={this.state.stars1}
              />

              <PlayerCard
                setPlayer={this.setPlayer2}
                query={this.getInput2}
                value={this.state.query2}
                results={this.state.results2}
                playerData={this.state.player2res}
                stars={this.state.stars2}
              />
            </div>
            <button className="startWar" onClick={this.start}>
              START WAR
            </button>
          </div>

          {/* <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            dummy testing link
          </a> */}
        </header>
      </div>
    );
  }
}

export default App;
