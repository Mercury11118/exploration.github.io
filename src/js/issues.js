start("Ghub-fr");

async function start(orgs) {
    await getRepo(orgs);
}

async function getIssues(repo, orgs) {
    var x = await gather('https://api.github.com/repos/' + orgs + '/' + repo + '/issues');
    for (var i in x) {
        var issueURL = await getValue(x[i], "html_url");
        var issueNumber = await getValue(x[i], "number");
        var issueLabels = await gather("https://api.github.com/repos/" + orgs + "/" + repo + "/issues/" + issueNumber + "/labels");
        var issueTitle = await getValue(x[i], "title");
        var user = await getValue(x[i], "user");
        var userLogin = await getValue(user, "login");
        var userAvatar = await getValue(user, "avatar_url");

        var state = await getValue(x[i], "state");
        var dateUpdate = await getValue(x[i], "updated_at");
        var body = await getValue(x[i], "body");

        await display(issueURL, issueLabels, repo, issueTitle, userLogin, userAvatar, state, dateUpdate, body);
    }
    if (x === null || x === undefined || x.length <= 0) { } else {
        var root = document.getElementById("github_issue");
        root.appendChild(document.createElement("hr"));
    }
}

async function getRepo(orgs) {
    var x = await gather('https://api.github.com/orgs/' + orgs + '/repos');
    for (var i in x) {
        var repo = await getValue(x[i], "name");
        await getIssues(repo, orgs);
    }
}

async function display(issueURL, issueLabels, repo, issueTitle, userLogin, userAvatar, state, dateUpdate, body) {
    var root = document.getElementById("github_issue");

    var div = document.createElement('div');
    div.className = "div";

    var img = document.createElement('img');
    img.src = userAvatar;
    img.className = "profile";
    div.appendChild(img);

    var a = document.createElement('a');
    a.textContent = userLogin;
    a.href = "https://github.com/" + userLogin;
    a.className = "username";
    div.appendChild(a);

    var a2 = document.createElement('a');
    a2.href = issueURL;
    a2.textContent = issueTitle;
    a2.className = "issuelink";
    div.appendChild(a2);

    for (var i in issueLabels) {
        var labelName = await getValue(issueLabels[i], "name");
        //var labelColor = await getValue(issueLabels[i], "color");
        var labelDescription = await getValue(issueLabels[i], "description");
        var img3 = document.createElement('p');
        if (labelName === "wontfix") {
            img3.textContent = "🙅🔨";
        } else if (labelName === "question") {
            img3.textContent = "☝💬";
        } else if (labelName === "invalid") {
            img3.textContent = "😡🔧";
        } else if (labelName === "help wanted") {
            img3.textContent = "🔥🆘";
        } else if (labelName === "good first issue") {
            img3.textContent = "🎓🎒";
        } else if (labelName === "enhancement") {
            img3.textContent = "✨🚀";
        } else if (labelName === "duplicate") {
            img3.textContent = "🎭♻";
        } else if (labelName === "documentation") {
            img3.textContent = "📚💾";
        } else if (labelName === "bug") {
            img3.textContent = "🐛🐞";
        }
        img3.className = "labelissue";
        div.appendChild(img3);
    }

    var img4 = document.createElement('p');
    if (state === "open") {
        img4.textContent = "📂📭";
    } else {
        img4.textContent = "❌🔐";
    }
    img4.className = "labelissue";
    div.appendChild(img4);

    var p = document.createElement('p');
    const date1 = new Date(dateUpdate);
    var date2 = date1.toLocaleString();
    p.textContent = date2;
    p.className = "date";
    div.appendChild(p);

    var p3 = document.createElement('p');
    p3.textContent = repo;
    p3.className = "repo";
    div.appendChild(p3);

    var p2 = document.createElement('p');
    p2.textContent = body;
    div.appendChild(p2);

    root.append(div);

    document.getElementById("loading").style = "display:none;";
}