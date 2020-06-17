import React from "react";
import axios from "axios";
import "./App.scss";

const Loading = () => {
  return (
    <div className="loading">
      <p>Loading results</p>
      <div className="dots">
        <div className="dot one"></div>
        <div className="dot two"></div>
        <div className="dot three"></div>
        <div className="dot four"></div>
        <div className="dot five"></div>
      </div>
    </div>
  );
};

const Results = (props) => {
  return (
    <div className="war-result">
      <div>
        <span>Followers</span>
        {props.playerData.followers}
      </div>
      <div>
        <span>Repositories</span>
        {props.playerData.public_repos}
      </div>
      <div>
        <span>Total STARS</span>
        {props.playerData.stars}
      </div>
    </div>
  );
};

const Winner = () => {
  return <div className="winner-tag">Winner</div>;
};

class PlayerCard extends React.Component {
  render() {
    const { results } = this.props;

    const profileImage = this.props.playerData.profileUrl
      ? {
          backgroundImage: "url(" + this.props.playerData.profileUrl + ")",
        }
      : { backgroundImage: "#b2ffe6" };

    const playerCardClasses =
      this.props.win === true ? "playerCard winner" : "playerCard notWinner";

    return (
      <div className={playerCardClasses}>
        {this.props.win === true ? <Winner /> : ""}
        <div className="card-content">
          <div className="profile-image" style={profileImage}></div>
          <h2>{this.props.war ? this.props.playerData.name : "Player"}</h2>
          {this.props.war ? (
            <Results playerData={this.props.playerData} />
          ) : (
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
              <ul class="searchResults">
                {results.length
                  ? results.map((item) => (
                      <li key={item.id} onClick={this.props.setPlayer}>
                        {item.login}
                      </li>
                    ))
                  : ""}
              </ul>
            </label>
          )}
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
    player1res: {
      name: "",
      followers: 0,
      public_repos: 0,
      stars: 0,
      profileUrl: "",
    },
    player2res: {
      name: "",
      followers: 0,
      public_repos: 0,
      stars: 0,
      profileUrl: "",
    },
    win1: false,
    win2: false,
    war: false,
    loading: false,
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

  fetchUser = async (username, num) => {
    const searchUrl = `https://api.github.com/users/${username}`;

    const starr = axios.get(`https://api.github.com/users/${username}/starred`);
    const user = axios.get(searchUrl);
    axios
      .all([starr, user])
      .then(
        axios.spread((...res) => {
          const length = res[0].data.length;
          const name = res[1].data.name;
          const followers = res[1].data.followers;
          const public_repos = res[1].data.public_repos;
          const profileUrl = res[1].data.avatar_url;

          num === 1
            ? this.setState({
                player1res: {
                  name: name,
                  followers: followers,
                  public_repos: public_repos,
                  profileUrl: profileUrl,
                  stars: length,
                },
              })
            : this.setState({
                player2res: {
                  name: name,
                  followers: followers,
                  public_repos: public_repos,
                  profileUrl: profileUrl,
                  stars: length,
                },
              });
          if (num === 2) {
            this.setState({ loading: false });
            this.declareWinner();
          }
        })
      )
      // .get(searchUrl)
      // .then((res) => {
      //   const userData = res.data;
      //   // console.log(userData);
      //   // const length = await
      //   // this.fetchStarred(username, num);
      //   num === 1
      //     ? this.setState({
      //         player1res: {
      //           name: userData.name,
      //           followers: userData.followers,
      //           public_repos: userData.public_repos,
      //           stars: length,
      //         },
      //       })
      //     : this.setState({
      //         player2res: {
      //           name: userData.name,
      //           followers: userData.followers,
      //           public_repos: userData.public_repos,
      //           stars: length,
      //         },
      //       });

      //   // this.fetchStarred(player2, 2);
      // })
      .catch((err) => console.log(err));
  };

  // fetchStarred = (username, num) => {
  //   const searchUrl = `https://api.github.com/users/${username}/starred`;

  //   axios
  //     .get(searchUrl)
  //     .then((res) => {
  //       const length = res.data.length;
  //       return length;
  //       // num === 1
  //       //   ? this.setState({ player1res: { stars: length } })
  //       //   : this.setState({ player2res: { stars: length } });
  //     })
  //     .catch((err) => console.log(err));
  // };

  start = async () => {
    if (this.state.war) {
      this.setState({
        query1: "",
        query2: "",
        player1: "",
        player2: "",
        player1res: { profileUrl: "" },
        player2res: { profileUrl: "" },
        results1: {},
        results2: {},
        war: false,
        win1: false,
        win2: false,
        loading: false,
      });
    } else {
      this.setState({ war: true, loading: true });

      const player1 = this.state.player1;
      const player2 = this.state.player2;

      await this.fetchUser(player1, 1);
      await this.fetchUser(player2, 2);

      // this.fetchUser(player1, 1)
      //   .then(() => this.fetchUser(player2, 2))
      //   .then(() => declareWinner());

      // declareWinner();
    }
  };
  declareWinner = () => {
    const foll1 = this.state.player1res.followers;
    const foll2 = this.state.player2res.followers;

    console.log(this.state);

    if (foll1 > foll2) this.setState({ win1: true, win2: false });
    else this.setState({ win1: false, win2: true });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <a href={App} className="logo">
            ./Github<span>Wars</span>
          </a> */}
          <div className="container">
            {this.state.loading ? (
              <Loading />
            ) : (
              <>
                <div className="arena">
                  <PlayerCard
                    setPlayer={this.setPlayer1}
                    query={this.getInput1}
                    value={this.state.query1}
                    results={this.state.results1}
                    playerData={this.state.player1res}
                    // stars={this.state.stars1}
                    war={this.state.war}
                    win={this.state.win1}
                  />

                  <PlayerCard
                    setPlayer={this.setPlayer2}
                    query={this.getInput2}
                    value={this.state.query2}
                    results={this.state.results2}
                    playerData={this.state.player2res}
                    // stars={this.state.stars2}
                    war={this.state.war}
                    win={this.state.win2}
                  />
                </div>
                <button className="startWar" onClick={this.start}>
                  {this.state.war ? "START AGAIN" : "START WAR"}
                </button>
              </>
            )}
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
