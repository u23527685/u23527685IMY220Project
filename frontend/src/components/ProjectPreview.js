import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import "../../public/assets/css/projectpreview.css"

// Wrapper to use navigate with class component
function withNavigate(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    }
}

class ProjectPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ownerUsername: 'Loading...'
        };
    }

    componentDidMount() {
        this.fetchOwner();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.project !== this.props.project) {
            this.fetchOwner();
        }
    }

    fetchOwner = async () => {
        const { project } = this.props;
        
        if (project?.owner) {
            try {
                const ownerId = typeof project.owner === 'object' ? 
                    (project.owner.$oid || project.owner._id || JSON.stringify(project.owner)) : 
                    project.owner;
                
                const response = await fetch(`http://localhost:3000/api/user/${ownerId}`);
                const data = await response.json();
                
                if (data.success && data.user) {
                    this.setState({ ownerUsername: data.user.username || 'Unknown' });
                } else {
                    this.setState({ ownerUsername: 'Unknown' });
                }
            } catch (error) {
                console.error('Error fetching owner:', error);
                this.setState({ ownerUsername: 'Unknown' });
            }
        }
    }

    download = () => {
        const { project, ondownload } = this.props;
        const projectId = typeof project._id === 'object' ? 
            (project._id.$oid || project._id.toString()) : 
            project._id;
        if (projectId && ondownload) {
            ondownload(projectId);
        }
    }

    toproject = () => {
        const { project, user, navigate } = this.props;
        const projectid = (() => {
            if (!project._id) return '';
            if (typeof project._id === "string") return project._id;
            if (project._id.$oid) return project._id.$oid;
            if (project._id._id) return project._id._id;
            return project._id.toString();
        })();

        const ownerId = typeof project.owner === 'object' ? 
            (project.owner.$oid || project.owner._id || project.owner.toString()) : 
            project.owner;
        const projectName = project.name || 'unnamed';
        const pid=projectid;
        navigate(`/project/${projectName}/${pid}`, { state: { project, user } });
    }

    touser = ()=>{
        const { navigate } = this.props;
        const {project,pin, save }= this.props;
        const ownerId = typeof project.owner === 'object' ? 
            (project.owner.$oid || project.owner._id || project.owner.toString()) : 
            project.owner;
        if (ownerId) {
            navigate(`/profile/${ownerId}`);
        } else {
            console.warn("Cannot navigate to user profile: ownerId is not available.");
        }
    }

    isOwner =()=>{
        const { project, user } = this.props
        const ownerId = typeof project.owner === 'object' ? 
            (project.owner.$oid || project.owner._id || project.owner.toString()) : 
            project.owner;

        const userId = typeof user._id === 'object' ? 
            (user._id.$oid || user._id.toString()) : 
            user._id;

        if(ownerId === userId)
            return true;

        return false;
    }

    isworkingonproject =()=>{
        const { project, user } = this.props;

        const userId = typeof user._id === 'object' ? 
            (user._id.$oid || user._id.toString()) : 
            user._id;

        if(this.isOwner())
            return true;

        let b=false;
        b=project.members.forEach(member => {
            if(member===userId){
                return true;
            }   
        });
        if(b!==true)
            b=false;
        return b;
    }

    onPin=()=>{
        const userId= sessionStorage.getItem("userId");
        const {project}= this.props;
        if (this.props.pin) {
            this.props.pin(userId, project._id);
        }
    }

    onSave=()=>{
        const{save}= this.props;
        const userId= sessionStorage.getItem("userId");
        const {project}= this.props;
        if(save)
            save(userId,project._id)
    }

    render() {
        const { project, ondownload, pin, save} = this.props;
        const { ownerUsername } = this.state;

        return (
            <div className="projectprev">
                <div className="usernameshow">
                    <div onClick={this.touser} style={{ cursor: 'pointer', fontWeight: 'bold' }} className="userName">{String(ownerUsername)}</div>
                </div>
                <div className="projectinf">
                    <h3 onClick={this.toproject} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                        {String(project.name || 'Unnamed Project')}
                    </h3>
                    <p>{String(project.description || '')}</p>
                    <p>{String(project.status || '')}</p>
                    <div>
                        {Array.isArray(project.hashtags) && project.hashtags.map((tag, i) => (
                            <span key={i} style={{ marginRight: '8px', color: '#007bff' }}>
                                #{String(tag)}
                            </span>
                        ))}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        {pin&& <button onClick={this.onPin}>Pin</button>}
                        {save&& <button onClick={this.onSave}>Save</button>}
                        {ondownload && <button onClick={this.download}>Download</button>}
                        <span style={{ marginLeft: '12px' }}>
                            {Array.isArray(project.activityFeed) ? project.activityFeed.length : 0} Activities
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNavigate(ProjectPreview);