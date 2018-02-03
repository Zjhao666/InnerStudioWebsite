package beans;

public class Member {
    private int id;
    public String realname;
    public String nickname;
    public String isOnline;
    public String pertag;
    public String account;
    public String password;
    public String isCaptain;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRealname() {
        return realname;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }
    
    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String isIsOnline() {
        return isOnline;
    }

    public void setIsOnline(String isOnline) {
        this.isOnline = isOnline;
    }

    public String getPertag() {
        return pertag;
    }

    public void setPertag(String pertag) {
        this.pertag = pertag;
    }
    
    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIsCaptain() {
        return isCaptain;
    }

    public void setIsCaptain(String isCaptain) {
        this.isCaptain = isCaptain;
    }
}
