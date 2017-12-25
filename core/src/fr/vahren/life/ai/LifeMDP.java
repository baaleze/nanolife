package fr.vahren.life.ai;


import org.deeplearning4j.gym.StepReply;
import org.deeplearning4j.rl4j.mdp.MDP;
import org.deeplearning4j.rl4j.space.DiscreteSpace;
import org.deeplearning4j.rl4j.space.ObservationSpace;

public class LifeMDP implements MDP<State,Integer,DiscreteSpace> {


    @Override
    public ObservationSpace<State> getObservationSpace() {
        return null;
    }

    @Override
    public DiscreteSpace getActionSpace() {
        return null;
    }

    @Override
    public State reset() {
        return null;
    }

    @Override
    public void close() {

    }

    @Override
    public StepReply<State> step(Integer action) {
        return null;
    }

    @Override
    public boolean isDone() {
        return false;
    }

    @Override
    public MDP<State, Integer, DiscreteSpace> newInstance() {
        return null;
    }
}
